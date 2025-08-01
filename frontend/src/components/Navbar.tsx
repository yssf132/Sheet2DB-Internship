function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-md rounded-xl mb-8">
      <div className="flex items-center gap-4">
        <img src="Sheet2DBLogo.png" alt="Sheet2DBR Logo" className="h-12 w-12 scale-[1.8] object-contain"/>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sheet2DBR</h1>
          <p className="text-gray-500 text-sm">Import and export Excel data easily</p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar