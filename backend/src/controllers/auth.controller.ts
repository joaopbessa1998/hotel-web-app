import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

// função de registo
//export const register = async (req: Request, res: Response): Promise<Response> => {
export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // verificar se utilizador com este email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email já registado.' });
      return;
    }

    // encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // criar novo utilizador
    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    // gerar token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1d' },
    );

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
  } catch (error) {
    console.error('Error no registo: ', error);
    res.status(500).json({
      message: 'Erro interno no servidor!',
    });
  }
};

// função de login
//export const login = async (req: Request, res: Response): Promise<Response> => {
export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // procurar user pelo email
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ message: 'Credenciais inválidas (user não encontrado).' });
      return;
    }

    // comparar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res
        .status(400)
        .json({ message: 'Credenciais inválidas (password inválida).' });
      return;
    }

    // gerar token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

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
  } catch (error) {
    console.error('Erro no login: ', error);
    res.status(500).json({ message: 'Erro internet no servidor!' });
  }
};

// função para obter dados do utilizador logado
//export const getMe = async (req: Request, res: Response): Promise<Response> => {
export const getMe: RequestHandler = async (req, res) => {
  try {
    // se usamos um middleware checkAuth que coloca o userId em req.body
    const userId = (req as any).userId; // vamos buscar do middleware de autenticação

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Utilizador não encontrado!' });
      return;
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error('Erro no /me: ', error);
    res.status(500).json({ message: 'Erro interno no servidor!' });
  }
};
