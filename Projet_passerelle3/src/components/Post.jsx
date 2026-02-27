import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";

const Post = ({ post }) => {
  const { user } = useAuth();

  // États de l'interface, création de toutes mes const
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  // États des données
  const [editText, setEditText] = useState(post.text);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const isOwner = user?.uid === post.authorId; // Petite sécurié, seul l'auteur du message peut modifier (pas testé avec plusieurs user, à test)
  const hasLiked = post.likedBy?.includes(user?.uid);

  const dateLabel = post.createdAt
    ? formatDistanceToNow(post.createdAt.toDate(), {
        addSuffix: true,
        locale: fr,
      })
    : "À l'instant";

  // Écrire des commentaires
  useEffect(() => {
    const q = query(
      collection(db, "posts", post.id, "comments"),
      orderBy("createdAt", "asc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [post.id]);

  //  ACTIONS pour les like, avec un coeur qui se rempli si like
  const handleLike = async () => {
    const postRef = doc(db, "posts", post.id);
    try {
      if (hasLiked) {
        await updateDoc(postRef, {
          likes: Math.max(0, (post.likes || 1) - 1),
          likedBy: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: (post.likes || 0) + 1,
          likedBy: arrayUnion(user.uid),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    try {
      await updateDoc(doc(db, "posts", post.id), { text: editText });
      setIsEditing(false);
      setShowOptions(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addDoc(collection(db, "posts", post.id, "comments"), {
        text: commentText,
        authorId: user.uid,
        authorName: user.username,
        createdAt: serverTimestamp(),
      });
      setCommentText("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 border-b border-gray-100 hover:bg-gray-50/50 transition flex flex-col relative group">
      <div className="flex gap-3">
        {/* AVATAR */}
        <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
          {post.authorName?.charAt(0).toUpperCase()}
        </div>

        {/* CONTENU */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">{post.authorName}</span>
            <span className="text-gray-400 text-sm">· {dateLabel}</span>
          </div>

          {/* ZONE TEXTE / MODIFICATION */}
          {isEditing ? (
            <div className="mt-2">
              <textarea
                className="w-full border border-sky-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white resize-none"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleUpdate}
                  className="bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 px-3 py-1 rounded-full text-xs font-bold"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-[15px] text-gray-800 leading-normal">
              {post.text}
            </p>
          )}

          {/* BARRE D'ACTIONS */}
          <div className="flex justify-between mt-3 max-w-xs text-gray-500 text-sm">
            <button
              onClick={() => setShowCommentInput(!showCommentInput)}
              className="hover:text-sky-500 flex items-center gap-1"
            >
              💬 <span>{comments.length}</span>
            </button>
            <button className="hover:text-green-500">🔁</button>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 ${hasLiked ? "text-pink-500" : "hover:text-pink-500"}`}
            >
              {hasLiked ? "❤️" : "🤍"} <span>{post.likes || 0}</span>
            </button>
          </div>

          {/* INPUT COMMENTAIRE */}
          {showCommentInput && (
            <div className="mt-3 flex gap-2 items-center bg-gray-50 p-2 rounded-xl">
              <input
                type="text"
                placeholder="Votre réponse..."
                className="flex-1 bg-transparent outline-none text-sm px-2"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendComment()} // Fonction qui permet de valider avec juste "entrer"
              />
              <button
                onClick={handleSendComment}
                className="bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold"
              >
                Envoyer
              </button>
            </div>
          )}

          {/* LISTE COMMENTAIRES */}
          {comments.length > 0 && (
            <div className="mt-4 space-y-3 border-l-2 border-gray-100 ml-2 pl-4">
              {comments.map((c) => (
                <div key={c.id} className="text-sm">
                  <span className="font-bold mr-2">{c.authorName}</span>
                  <span className="text-gray-700">{c.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MENU (...) */}
      {isOwner && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-400 font-bold px-2 hover:text-sky-500"
          >
            ...
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-1 w-32 bg-white border shadow-lg rounded-xl z-20 py-1 overflow-hidden">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 font-bold"
                onClick={() => {
                  setIsEditing(true);
                  setShowOptions(false); // Permet de cacher mes deux options et que je clique, affiche
                }}
              >
                Modifier
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-500 font-bold"
                onClick={() => deleteDoc(doc(db, "posts", post.id))}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
