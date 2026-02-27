import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Tentative de connexion en cours..."); // Pour vérifier que le bouton fonctionne
    try {
      // 1. Authentification
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password,
      );
      const user = userCredential.user;
      console.log("Utilisateur authentifié :", user.uid);

      // 2. Récupération du profil dans Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        console.log("Données Firestore récupérées :", userDoc.data());
        login(userDoc.data()); // Met à jour le contexte
        navigate("/home"); // Redirige
      } else {
        console.warn(
          "L'utilisateur existe dans Auth mais pas dans Firestore !",
        );
        // Cas de secours : on utilise les infos de Auth
        login({
          uid: user.uid,
          email: user.email,
          username: user.displayName || "Utilisateur",
        });
        navigate("/home");
      }
    } catch (error) {
      console.error("Erreur de connexion détaillée :", error);

      // Affichage d'un message clair
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        alert("Email ou mot de passe incorrect.");
      } else {
        alert("Erreur : " + error.message);
      }
    }
  };

  return { register, handleSubmit: handleSubmit(onSubmit), errors };
};
