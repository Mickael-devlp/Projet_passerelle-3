import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

import TweetBox from "../components/TweetBox";
import Post from "../components/Post";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    // Fonction trouvé pour permettre d'économiser dsu temps et de la data. Quand l'user quitte la page, ça coupe la co avec firebase
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    logout();
    // Une fois déco, ça nous renvoi à la page login
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen max-w-7xl mx-auto bg-white">
      {/* --- COLONNE GAUCHE --- */}

      <aside className="w-1/4 sticky top-0 h-screen border-r border-gray-100 p-4 pt-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-sky-500 mb-8 px-4 italic">
            Cocey
          </h1>
          <nav className="space-y-2">
            <NavItem label="🏠 Accueil" active />
            <NavItem label="Notifications" />
            <NavItem label="Messages" />
            <NavItem label="Profil" />
          </nav>
        </div>

        <div className="p-3 flex items-center gap-3 hover:bg-gray-100 rounded-full cursor-pointer transition mb-4">
          <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate text-sm">{user?.username}</p>
            <p className="text-gray-500 text-xs truncate">
              @{user?.email?.split("@")[0]}
            </p>
          </div>
        </div>
      </aside>

      {/* --- COLONNE CENTRE --- */}
      <main className="flex-1 border-r border-gray-100 min-h-screen">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 pt-6 border-b border-gray-100 z-10">
          <h2 className="text-xl font-bold">Accueil</h2>
        </div>

        <TweetBox />

        <div className="pb-20">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </main>

      {/* --- COLONNE DROITE  --- */}
      <aside className="w-1/3 sticky top-0 h-screen p-4 pt-4 hidden lg:block">
        <button
          onClick={handleLogout}
          className="w-full mb-6 py-2 px-4 text-red-500 border border-red-100 hover:bg-red-50 rounded-full transition text-sm font-bold shadow-sm"
        >
          Se déconnecter
        </button>

        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-bold text-lg mb-4 px-2">Tendances pour vous</h3>
          <TrendItem topic="#Believemy" posts="100k" />
          <TrendItem topic="#ReactV4" posts="12.5k" />
          <TrendItem topic="#Firebase" posts="8.2k" />
          <TrendItem topic="#TailwindCSS" posts="45k" />
        </div>
      </aside>
    </div>
  );
};

// Composants internes DRY // Je n'ai pas mis de composant dans global.css car d'après deux vidéos, c'est obsolète et en mettant directement dans Home, permet une meilleure gestion
// si il n'y a pas beaucoup de ligne. A voir la correction.
const NavItem = ({ label, active }) => (
  <div
    className={`flex items-center p-3 px-4 rounded-full hover:bg-gray-100 cursor-pointer transition text-xl ${active ? "font-bold" : "font-medium"}`}
  >
    <span>{label}</span>
  </div>
);

const TrendItem = ({ topic, posts }) => (
  <div className="py-3 hover:bg-gray-200/50 cursor-pointer transition px-4 rounded-xl">
    <p className="text-xs text-gray-500">Tendance</p>
    <p className="font-bold">{topic}</p>
    <p className="text-xs text-gray-500">{posts} posts</p>
  </div>
);

export default Home;
