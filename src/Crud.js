import React, { useEffect, useState } from "react";
import { fireDb } from "./firebase";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";

function FirebaseFirestore() {
  const [val, setVal] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

  const value = collection(fireDb, "User");

  useEffect(() => {
    const getData = async () => {
      const dbVal = await getDocs(value);
      setVal(dbVal.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getData();
  }, []);

  // Fonction pour l'archivage
  const handleArchive = async (id) => {
    const userDoc = doc(fireDb, "User", id);
    await updateDoc(userDoc, { isArchived: true });
    // Mettre à jour l'état après l'archivage
    setVal(val.filter((item) => item.id !== id));
  };

  // suppression d'un utilisateur
  const handleDelete = async (id) => {
    const deleteVal = doc(fireDb, "User", id);
    await deleteDoc(deleteVal);
    setVal(val.filter((item) => item.id !== id));
  };

  // Filtrage des utilisateurs
  const filteredUsers = val.filter((user) => {
    return (
      !user.isArchived &&
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.address.toLowerCase().includes(search.toLowerCase()) ||
        user.city.toLowerCase().includes(search.toLowerCase()) ||
        user.pin.toLowerCase().includes(search.toLowerCase()) ||
        user.country.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Pagination
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
  const startOffset = currentPage * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const currentItems = filteredUsers.slice(startOffset, endOffset);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-title">
          <h2>Etudiant</h2>
        </div>
        <div className="card-body">
          <div className="divbtn">
            <Link to="/create" className="btn btn-success">Add New</Link>
          </div>
          <div>
            <Link to="/archive" className="liste btn btn-success">Liste des Etudiants archivés</Link>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <table className="table table-bordered" style={{ marginTop: "90px" }}>
            <thead className="text-white">
              <tr>
                <td className="bg-dark text-white">Photos</td>
                <td className="bg-dark text-white">Name</td>
                <td className="bg-dark text-white">ADDRESS</td>
                <td className="bg-dark text-white">CITY</td>
                <td className="bg-dark text-white">PIN</td>
                <td className="bg-dark text-white">COUNTRY</td>
                <td className="bg-dark text-white">ACTION</td>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((values) => (
                  <tr key={values.id}>
                    <td>
                      <img
                        src={values.imageUrl}
                        width="50"
                        height="50"
                        alt="User"
                        style={{ borderRadius: "50%", marginLeft: "30px" }}
                      />
                    </td>
                    <td>{values.name}</td>
                    <td>{values.address}</td>
                    <td>{values.city}</td>
                    <td>{values.pin}</td>
                    <td>{values.country}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(values.id)}
                      >
                        Delete
                      </button>
                      <Link to={`/update/${values.id}`}>
                        <button className="edit btn btn-warning">Edit</button>
                      </Link>
                      <Link to={`/view/${values.id}`}>
                        <button
                          className="view btn btn-info"
                          style={{ marginLeft: "50px" }}
                        >
                          View
                        </button>
                      </Link>
                      <button
                        className="arch btn btn-secondary"
                        onClick={() => handleArchive(values.id)}
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    L'étudiant(e) que vous cherchez n'existe pas!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* PAGINATION */}
          <ReactPaginate
            previousLabel={"precedent"}
            nextLabel={"suivant"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </div>
  );
}

export default FirebaseFirestore;
