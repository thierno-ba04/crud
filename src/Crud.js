import React, { useEffect, useState } from "react";
import { fireDb } from "./firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import{search, setSearch, filteredval} from "react"

function FirebaseFirestore() {
  const [id, setId] = useState("");
  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [city, setcity] = useState("");
  const [pin, setpin] = useState("");
  const [country, setcountry] = useState("");

  const [show, setShow] = useState(false);

  const [val, setVal] = useState([]);

  const value = collection(fireDb, "User");
  const [search, setSearch] = useState(""); // State for search

  useEffect(() => {
    const getData = async () => {
      const dbVal = await getDocs(value);
      setVal(dbVal.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getData();
  }, []);

  //  fonctino pour la suppression
  const handleDelete = async (id) => {
    const deleteVal = doc(fireDb, "User", id);
    await deleteDoc(deleteVal);
        // Update state after deletion
        setVal(val.filter((item) => item.id !== id));
  };

  // METHODE RECHERCHE

  const filteredUsers = val.filter((user) => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.address.toLowerCase().includes(search.toLowerCase()) ||
      user.city.toLowerCase().includes(search.toLowerCase()) ||
      user.pin.toLowerCase().includes(search.toLowerCase()) ||
      user.country.toLowerCase().includes(search.toLowerCase())
    );
  });


  // FIN  METHODE RECHERCHE

  return (
    <div className="container">
      <div className="card">
        <div className="card-title">
          <h2>Etudiant</h2>
        </div>
        <div className="card-body">
          <div className="divbtn">
            <Link to="/create" className="btn btn-success">
              Add New
            </Link>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <table className="table table-bordered">
            <thead className="text-white">
              <tr >
                {/* <td className="bg-dark text-white">ID</td> */}
                <td className="bg-dark text-white">Name</td>
                <td className="bg-dark text-white">ADDRESS</td>
                <td className="bg-dark text-white">CITY</td>
                <td className="bg-dark text-white">PIN</td>
                <td className="bg-dark text-white">COUNTRY</td>
                <td className="bg-dark text-white">ACTION</td>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((values) => (               
                  <tr key={values.id}>
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
                        <button className="btnn">Edit</button>
                      </Link>
                      <Link to={`/view/${values.id}`}><button>Vieuw</button></Link>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default FirebaseFirestore;
