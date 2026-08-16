const Usuario = require('../models/Usuario')

// Operação de Carga Inicial em Lote 
const cargaLote = (req, res) => {
    const listaUsuarios = req.body

    if (!listaUsuarios || listaUsuarios.length === 0) {
        return res.status(400).json({ message: 'Nenhum dado válido foi enviado para a carga em lote de usuários!' })
    }

    const usuariosMapeados = []

    for (let i = 0; i < listaUsuarios.length; i++) {
        const item = listaUsuarios[i]

        usuariosMapeados.push({
            nome: item.nome || item.firstName,
            sobrenome: item.sobrenome || item.lastName,
            idade: item.idade || item.age,
            email: item.email,
            telefone: item.telefone || item.phone,
            endereco: item.endereco || (item.address ? item.address.address : ''),
            cidade: item.cidade || (item.address ? item.address.city : ''),
            estado: item.estado || (item.address ? item.address.state : '')
        })
    }

    Usuario.bulkCreate(usuariosMapeados)
        .then(() => {
            res.status(201).json({ message: 'Carga em lote de usuários realizada com sucesso no banco!' })
        })
        .catch((err) => {
            console.error('Erro no bulkCreate de usuários:', err)
            res.status(500).json({ message: 'Erro ao salvar os usuários em lote no banco de dados' })
        })
}

const listar = async (req,res)=>{
    try{
        const dados = await Usuario.findAll()
        res.status(200).json(dados)
    }catch(err){
        console.error('Não foi possível listar os Usuários',err)
        res.status(500).json({message: 'Não foi possível listar os Usuários'})
    }
}

const buscarPorCod = async (req,res)=>{
    const id = req.params.id
    try{
        const dados = await Usuario.findByPk(id)
        if(!dados){
            res.status(404).json({message: 'Usuário não encontrado!'})
        }else{
            res.status(200).json(dados)
        }
    }catch(err){
        console.error('Não foi possível encontrar o Usuário',err)
        res.status(500).json({message: 'Não foi possível encontrar o Usuário'})
    }
}

const buscarPorNome = async (req,res)=>{
    const nome = req.params.nome
    try{
        const dados = await Usuario.findOne({where: { nome: nome}})
        if(!dados){
            res.status(404).json({message: 'Nome do Usuário não encontrado!'})
        }else{
            res.status(200).json(dados)
        }
    }catch(err){
        console.error('Não foi possível encontrar o nome do Usuário',err)
        res.status(500).json({message: 'Não foi possível encontrar o nome do Usuário'})
    }
}

const apagar = async (req,res)=>{
    const id = req.params.id
    try{
        const dados = await Usuario.findByPk(id)
        if(!dados){
            res.status(404).json({message: 'Usuário não encontrado no banco de dados!'})
        }else{2
            await Usuario.destroy({where: { codUsuario: id}})
            res.status(200).json({message: 'Usuário excluído com sucesso!'})
        }
    }catch(err){
        console.error('Não foi possível excluir o Usuário',err)
        res.status(500).json({message: 'Não foi possível excluir o Usuário'})
    }
}

const atualizar = async (req,res)=>{
    const id = req.params.id
    const valores = req.body
    try{
        let dados = await Usuario.findByPk(id)
        if(!dados){
            res.status(404).json({message: 'Usuário não encontrado no banco de dados!'})
        }else{
            await Usuario.update(valores, { where: { codUsuario: id}})
            dados = await Usuario.findByPk(id)
            res.status(200).json(dados)
        }
    }catch(err){
        console.error('Não foi possível atualizar o Usuário',err)
        res.status(500).json({message: 'Não foi possível atualizar o Usuário'})
    }
}

module.exports = { cargaLote, listar, buscarPorCod, buscarPorNome, apagar, atualizar}