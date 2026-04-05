import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "income",
    description: "",
    amount: "",
  });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/transaction/add", form);

      setForm({
        type: "income",
        description: "",
        amount: "",
      });

      fetchTransactions();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const [filters, setFilters] = useState({
    type: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transaction/getTransaction", {
        params: {
          page,
          limit: 5,
          ...filters,
        },
      });

      setTransactions(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 401) {
        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body">
          <h2 className="text-xl font-bold">Add Transaction</h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-3">
            <select
              name="type"
              value={form.type}
              onChange={handleFormChange}
              className="select select-bordered"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleFormChange}
              className="input input-bordered"
              required
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleFormChange}
              className="input input-bordered"
              required
            />

            <button className="btn btn-primary md:col-span-3">
              Add Transaction
            </button>
          </form>
        </div>
      </div>

      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body">
          <h2 className="text-xl font-bold">Filters & Sorting</h2>

          <div className="grid md:grid-cols-4 gap-3">
            <select
              name="type"
              className="select select-bordered"
              onChange={handleChange}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type="number"
              name="minAmount"
              placeholder="Min Amount"
              className="input input-bordered"
              onChange={handleChange}
            />

            <input
              type="number"
              name="maxAmount"
              placeholder="Max Amount"
              className="input input-bordered"
              onChange={handleChange}
            />

            <input
              type="date"
              name="startDate"
              className="input input-bordered"
              onChange={handleChange}
            />

            <input
              type="date"
              name="endDate"
              className="input input-bordered"
              onChange={handleChange}
            />

            <select
              name="sortBy"
              className="select select-bordered"
              onChange={handleChange}
            >
              <option value="createdAt">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="type">Sort by Type</option>
            </select>

            <select
              name="order"
              className="select select-bordered"
              onChange={handleChange}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="text-xl font-bold mb-3">Transactions</h2>

          {transactions.length === 0 ? (
            <p className="text-center">No transactions found</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <div
                  key={t._id}
                  className="flex justify-between items-center border p-4 rounded-xl hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold text-lg">{t.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        t.type === "income" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      ₹{t.amount}
                    </p>
                    <p className="capitalize text-sm">{t.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className="btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span className="font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              className="btn btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTransactions;
