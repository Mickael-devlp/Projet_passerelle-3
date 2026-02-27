import React from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

// Uniquement la partie visible, la logique sera crée dans un hook personnalisé

const Login = () => {
  const { register, handleSubmit, errors } = useLogin();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-brand-primary italic">
            Cocey
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Connectez-vous à votre compte
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <input
                {...register("email", { required: "L'email est requis" })}
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

            {/* Password */}
            <div>
              <input
                {...register("password", {
                  required: "Le mot de passe est requis",
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
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 text-white py-3 rounded-full font-bold text-lg shadow-sm hover:bg-sky-600 transition-colors duration-200 mt-4"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-gray-600">
          Pas encore de compte ?{" "}
          {/* Uitilisation de Link et non a ou sinon refresh de la page */}
          <Link to="/register" className="text-brand-primary hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
