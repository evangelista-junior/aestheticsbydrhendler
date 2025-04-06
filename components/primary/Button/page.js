export default function Button({ children }) {
  return (
    <button
      className="
     bg-white font-bold text-black p-4 rounded-md shadow-[0_4px_4px_rgba(0,0,0,0.25)] cursor-pointer border-b-4 border-white
     hover:border-red-300 hover:scale-105 transition duration-400 
     "
    >
      {children}
    </button>
  );
}
