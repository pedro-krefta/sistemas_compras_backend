const Produto = require('../models/Produto')

// Operação de Carga Inicial em Lote 
const cargaLote = (req, res) => {
    const listaProdutos = req.body

    if (!listaProdutos || listaProdutos.length === 0) {
        return res.status(400).json({ message: 'Nenhum dado válido foi enviado para a carga em lote!' })
    }

    const produtosMapeados = []

    for (let i = 0; i < listaProdutos.length; i++) {
        const item = listaProdutos[i]

        // Mapeamento rigoroso batendo com o seu arquivo Produto.js
        produtosMapeados.push({
            nome: item.nome || item.title,
            descricao: item.descricao || item.description,
            categoria: item.categoria || item.category,
            preco: item.preco || item.price,
            desconto: item.desconto || item.discountPercentage,
            qtdeEstoque: item.qtdeEstoque || item.stock,
            marca: item.marca || item.brand,
            imagem: item.imagem || item.thumbnail
        })
    }

    Produto.bulkCreate(produtosMapeados)
        .then(() => {
            res.status(201).json({ message: 'Carga em lote de produtos realizada com sucesso no banco!' })
        })
        .catch((err) => {
            console.error('Erro no bulkCreate de produtos:', err)
            res.status(500).json({ message: 'Erro ao salvar os produtos em lote no banco de dados' })
        })
}

const listar = async (req,res)=>{
    try{
        const dados = await Produto.findAll()
        res.status(200).json(dados)
    }catch(err){
        console.error('Não foi possível listar os Produtos',err)
        res.status(500).json({message: 'Não foi possível listar os Produtos'})
    }
}

const buscarPorCod = async (req,res)=>{
    const id = req.params.id
    try{
        const dados = await Produto.findByPk(id)
        if(!dados){
            res.status(404).json({message: 'Produto não encontrado!'})
        }else{
            res.status(200).json(dados)
        }
    }catch(err){
        console.error('Não foi possível encontrar o Produto',err)
        res.status(500).json({message: 'Não foi possível encontrar o Produto'})
    }
}

const buscarPorNome = async (req,res)=>{
    const nome = req.params.nome
    try{
        const dados = await Produto.findOne({where: { nome: nome}})
        if(!dados){
            res.status(404).json({message: 'Nome do Produto não encontrado!'})
        }else{
            res.status(200).json(dados)
        }
    }catch(err){
        console.error('Não foi possível encontrar o nome do Produto',err)
        res.status(500).json({message: 'Não foi possível encontrar o nome do Produto'})
    }
}

const excluir = async (req,res)=>{
    const id = req.params.id
    try{
        const dados = await Produto.findByPk(id)
        if(!dados){
            res.status(404).json({message: 'Produto não encontrado no banco de dados!'})
        }else{
            await Produto.destroy({where: { codProduto: id}})
            res.status(200).json({message: 'Produto excluído com sucesso!'})
        }
    }catch(err){
        console.error('Não foi possível excluir o Produto',err)
        res.status(500).json({message: 'Não foi possível excluir o Produto'})
    }
}

const atualizar = async (req,res)=>{
    const id = req.params.id
    const valores = req.body
    try{
        let dados = await Produto.findByPk(id)
        if(!dados){
            res.status(404).json({message: 'Produto não encontrado no banco de dados!'})
        }else{
            await Produto.update(valores, { where: { codProduto: id}})
            dados = await Produto.findByPk(id)
            res.status(200).json(dados)
        }
    }catch(err){
        console.error('Não foi possível atualizar o Produto',err)
        res.status(500).json({message: 'Não foi possível atualizar o Produto'})
    }
}

module.exports = { cargaLote, listar, buscarPorCod, buscarPorNome, excluir, atualizar}
