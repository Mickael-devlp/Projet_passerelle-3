import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Permet de lié à firebase
import { doc, setDoc } from "firebase/firestore";

export const useRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Création du compte. Utilisation de await pour attendre que la promesse se termine, sans ça, j'ai eu qqs erreurs car le chargement est long.
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password,
      );
      const user = userCredential.user;

      // Mise à jour du profil
      await updateProfile(user, { displayName: data.username });

      //Stockage dans Firestore
      const userProfile = {
        uid: user.uid,
        username: data.username,
        email: data.email.trim(),
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", user.uid), userProfile);

      // Connexion locale et redirection
      login(userProfile);
      navigate("/home");
    } catch (error) {
      // En cas d'erreur de co vers firbase comme j'ai eu.
      console.error("Code d'erreur Firebase :", error.code);
      // Permet de reprendre les erreurs de FB illisible pour les rendre plus lisible pour l'user
      if (error.code === "auth/email-already-in-use") {
        alert("Cet email est déjà utilisé. Essaie de te connecter !");
      } else if (error.code === "auth/invalid-email") {
        alert("Le format de l'adresse email n'est pas valide.");
      } else if (error.code === "auth/weak-password") {
        alert("Le mot de passe est trop court (6 caractères minimum).");
      } else {
        alert("Une erreur est survenue : " + error.message);
      }
    }
  };

  return { register, handleSubmit: handleSubmit(onSubmit), errors };
};
