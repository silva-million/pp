const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/studentcrud")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

app.get("/", (req, res) => res.redirect("/students"));

app.get("/students", async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.render("students/index", { students });
});

app.post("/students", async (req, res) => {
  const { name, age, course } = req.body;
  await Student.create({ name, age, course });
  res.redirect("/students");
});

app.get("/students/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("Student not found");
  res.render("students/show", { student });
});

app.get("/students/:id/edit", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("Student not found");
  res.render("students/edit", { student });
});

app.post("/students/:id/update", async (req, res) => {
  const { name, age, course } = req.body;
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { name, age, course },
    { new: true, runValidators: true }
  );
  if (!student) return res.status(404).send("Student not found");
  res.redirect(`/students/${req.params.id}`);
});

app.post("/students/:id/delete", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect("/students");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
