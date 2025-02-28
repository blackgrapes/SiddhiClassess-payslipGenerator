import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Editstudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "",
    rollNumber: "",
    className: "",
    phoneNumber: "",
    totalFees: "",
    feesPaid: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.example.com/students/${id}`)
      .then((response) => {
        setStudent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch student data");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`https://api.example.com/students/${id}`, student)
      .then(() => {
        alert("Student updated successfully!");
        navigate("/student-list");
      })
      .catch((error) => setError("Failed to update student"));
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-brown-800 mb-6">Edit Student</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={student.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-3 rounded-lg w-full"
        />
        <input
          type="text"
          name="rollNumber"
          value={student.rollNumber}
          onChange={handleChange}
          placeholder="Roll Number"
          className="border p-3 rounded-lg w-full"
        />
        <input
          type="text"
          name="className"
          value={student.className}
          onChange={handleChange}
          placeholder="Class"
          className="border p-3 rounded-lg w-full"
        />
        <input
          type="text"
          name="phoneNumber"
          value={student.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border p-3 rounded-lg w-full"
        />
        <input
          type="number"
          name="totalFees"
          value={student.totalFees}
          onChange={handleChange}
          placeholder="Total Fees"
          min="0"
          className="border p-3 rounded-lg w-full"
        />
        <input
          type="number"
          name="feesPaid"
          value={student.feesPaid}
          onChange={handleChange}
          placeholder="Fees Paid"
          min="0"
          className="border p-3 rounded-lg w-full"
        />
        <div className="col-span-2 flex justify-between mt-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={() => navigate("/student-list")}
          >
            Cancel
          </button>
          <button type="submit" className="bg-brown-700 text-white px-4 py-2 rounded-lg">
            Update Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editstudent;
