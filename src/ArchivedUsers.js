import React, { useEffect, useState } from "react";
import { fireDb } from "./firebase";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

function ArchivedUsers() {
  const [archivedUsers, setArchivedUsers] = useState([]);


  
  // Désarchiver un utilisateur qui est lié avec le button désarchiver
  const handleUnarchive = async (id) => {
    const userDoc = doc(fireDb, "User", id);
    await updateDoc(userDoc, { isArchived: false });
    setArchivedUsers(archivedUsers.filter((user) => user.id !== id));
  };

    // fin  Désarchiver un utilisateur




  //  suppression d'un utilisateur
  const handleDelete = async (id) => {
    const deleteVal = doc(fireDb, "User", id);
    await deleteDoc(deleteVal);
    setArchivedUsers(archivedUsers.filter((user) => user.id !== id));
  };

  // fin suppression d'un utilisateur

  useEffect(() => {
    const getArchivedUsers = async () => {
      try {
        const value = collection(fireDb, "User");
        const dbVal = await getDocs(value);
        const users = dbVal.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log("All users: ", users);
        const archived = users.filter((user) => user.isArchived);
        console.log("Archived users: ", archived);
        setArchivedUsers(archived);
      } catch (error) {
        console.error("Error getting archived users: ", error);
      }
    };
    getArchivedUsers();
  }, []);

  return (
    <div className="container">
      <h2>Archived Users</h2>
      <div className="divbtn">
            <Link to="/" className="btn btn-success">Back</Link>
          </div>
      <table className="table table-bordered">
        <thead>
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
          {archivedUsers.length > 0 ? (
            archivedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.imageUrl}
                    width="50"
                    height="50"
                    alt="User"
                    style={{ borderRadius: "50%", marginLeft: "30px" }}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.city}</td>
                <td>{user.pin}</td>
                <td>{user.country}</td>
                <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                      <Link to={`/update/${user.id}`}>
                        <button className="edit btn btn-warning">Edit</button>
                      </Link>
                      <Link to={`/view/${user.id}`}>
                        <button
                          className="view btn btn-info"
                          style={{ marginLeft: "50px" }}
                        >
                          View
                        </button>
                      </Link>
                      <button
                    className="arch btn btn-secondary"
                    onClick={() => handleUnarchive(user.id)}
                  >
                    Desarchiver
                  </button>
                    </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Aucun(e) personne n'est archives!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ArchivedUsers;
