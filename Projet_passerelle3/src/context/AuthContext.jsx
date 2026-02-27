import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Création du contexte
const AuthContext = createContext();

// 2. Le Provider (le composant qui entoure l'appli)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulation d'une vérification de session (en attendant Firebase)
  useEffect(() => {
    // Permet de garder la session active même en refraichissant avec f5 ou en fermant la page.
    const savedUser = localStorage.getItem("cocey_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    // JSON.stringify permet de stocker les valeurs dans le nav (idéal en cas de fermeture de page pour éviter de se reco)
    localStorage.setItem("cocey_user", JSON.stringify(userData));
  };

  // Fct simple pour se déco
  const logout = () => {
    setUser(null);
    localStorage.removeItem("cocey_user");
  };

  // Utilisation de Authconext.provider et d'avoir déclarer const Authprovider, permet à toutes mes pages d'utiliser les composants comme login, logout...
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Obligé de mettre !loadind ans children car React va trop vite et ma co avec firebase est lente. J'avais souvent rien... */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Hook personnalisé pour utiliser le contexte facilement
export const useAuth = () => useContext(AuthContext);

// Dans une vidéo, j'ai vu qu'il faudrait que je remplace localStorage par "onAuthStateChanged" qui est une fonction native de firebase
// Cela me permettra d'avoir une réponse plus rapide et plus sécurisé.
