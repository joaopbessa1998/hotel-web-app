// src/controllers/auth.controller.ts

import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1) Verifica se já existe user com este email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email já registado.' });
      return;
    }

    // 2) Encripta a password e cria o User
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    // 3) Gera token JWT
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1d' },
    );

    // 4) Envia resposta de sucesso
    res.status(201).json({
      message: 'Utilizador criado com sucesso!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
    return; // retorna void
  } catch (error) {
    console.error('Error no registo: ', error);
    res.status(500).json({ message: 'Erro interno no servidor!' });
    return;
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Procura o user
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ message: 'Credenciais inválidas (user não encontrado).' });
      return;
    }

    // 2) Verifica password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res
        .status(400)
        .json({ message: 'Credenciais inválidas (password inválida).' });
      return;
    }

    // 3) Gera token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    // 4) Envia resposta
    res.json({
      message: 'Login bem sucedido!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
    return;
  } catch (error) {
    console.error('Erro no login: ', error);
    res.status(500).json({ message: 'Erro interno no servidor!' });
    return;
  }
};

export const getMe: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Utilizador não encontrado!' });
      return;
    }

    res.json({ user });
    return;
  } catch (error) {
    console.error('Erro no /me: ', error);
    res.status(500).json({ message: 'Erro interno no servidor!' });
    return;
  }
};
