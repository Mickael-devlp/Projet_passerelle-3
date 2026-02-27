import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const TweetBox = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!data.content.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        //En utilisant addDoc on permet à firebase de généréer l'ID, on n'a pas à s'en occuper
        text: data.content,
        authorId: user.uid,
        authorName: user.username,
        authorEmail: user.email,
        createdAt: serverTimestamp(), // Heure de firebase, ne pas use Date Time car elle se cale sur l'heure du tel ou ordi
      });
      reset(); // A préféré au lieu de setText(""). Car reset permet de nettoyer le champ plus efficacement et évite d'use des "set"
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b border-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <textarea
            {...register("content")}
            placeholder="Quoi de neuf ?"
            className="grow w-full text-xl border-none focus:outline-none resize-none py-2 min-h-32 bg-transparent"
          />
        </div>
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={loading} // permet de ne pas afficher plusieurs messages si l'user est impatient car la co est lente par exemple...
            className="bg-sky-500 text-white px-6 py-2 rounded-full font-bold hover:bg-sky-600 disabled:opacity-50"
          >
            {loading ? "..." : "Poster"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TweetBox;
