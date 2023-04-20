import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password" });
    }
    
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
    return res.status(400).json({ message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
    const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    });
    return res.status(201).json({ success: true, data: newUser });
    } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error creating user" });
    }
    }
