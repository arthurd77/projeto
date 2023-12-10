const knex = require("../db/conexao");


const clienteExiste = async (req, res, next) => {
  const clienteId = req.params.id;

  const cliente = await knex("clientes")
    .select("*")
    .where("id", clienteId)
    .first();

  if (!cliente) {
    return res.status(404).json({ mensagem: "Cliente não encontrado" });
  }

  req.cliente = cliente;

  return next();
};


const validarCliente = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    return next();
    
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    })
  }
}

const verificarEmailCliente = async (req, res, next) => {
  try {
    const { email } = req.body;
    const emailExistente = await knex("clientes")
      .select("id", "email")
      .from("clientes")
      .where("email", email)
      .first();
    if (emailExistente) {
      return res.status(401).json({
        mensagem: "E-mail já está sendo utilizado.",
      });
    }
    return next();
  } catch (erorr) {
    return res.status(500).json({
      mensagem: "Erro interno do Servidor",
    });
  }
};

const verificarCPFCliente = async (req, res, next) => {
  try {
    const { cpf } = req.body;
    const cpfExistente = await knex("clientes")
      .select("id", "cpf")
      .from("clientes")
      .where("cpf", cpf)
      .first();
    if (cpfExistente) {
      return res.status(401).json({
        mensagem: "CPF já está sendo utilizado.",
      });
    }
    return next();
  } catch (erorr) {
    return res.status(500).json({
      mensagem: "Erro interno do Servidor",
    });
  }
};



module.exports = {
  clienteExiste,
  validarCliente,
  verificarEmailCliente,
  verificarCPFCliente
};
