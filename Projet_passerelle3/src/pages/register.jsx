import React from "react";
import { Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";

// Uniquement la partie visible, la logique sera crée dans un hook personnalisé

const Register = () => {
  // Création d'un hook personnalisé
  const { register, handleSubmit, errors } = useRegister();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-brand-primary">Cocey</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Créez votre compte
          </h2>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Champ pseudo */}
          <div>
            <input
              {...register("username", { required: "Le pseudo est requis" })}
              type="text"
              placeholder="Nom d'utilisateur"
              // Utilisation du "Rendu conditionnel" inspiré d'un cours, très pratique
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-brand-primary outline-none transition ${errors.username ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Champ Email */}
          <div>
            <input
              {...register("email", {
                required: "L'email est requis",
                // Utilisation de pattern comme dans l'exemple pour autorisé tous les types de caractères
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Format d'email invalide",
                },
              })}
              type="email"
              placeholder="Adresse email"
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-brand-primary outline-none transition ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Champ Password */}
          <div>
            <input
              {...register("password", {
                required: "Le mot de passe est requis",
                minLength: { value: 6, message: "6 caractères minimum" },
              })}
              type="password"
              placeholder="Mot de passe"
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-brand-primary outline-none transition ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 text-white py-3 rounded-full font-bold text-lg shadow-sm hover:bg-sky-600 transition-colors duration-200 mt-4"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-center text-gray-600">
          Déjà inscrit ?{" "}
          {/* Uitilisation de "Link" et non "a" ou sinon refresh de la page */}
          <Link to="/login" className="text-brand-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
