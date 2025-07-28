const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.createPost = async (req, res) => {
  const { title, content } = req.body
  const authorId = req.user.userId

  if (!title || !content) {
    return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' })
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      }
    })
    return res.status(201).json(post)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao criar post.' })
  }
}

exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    })
    return res.json(posts)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao buscar posts.' })
  }
}

exports.getPostById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true } } }
    })
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado.' })
    }
    return res.json(post)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao buscar post.' })
  }
}

exports.updatePost = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, published } = req.body
  const userId = req.user.userId
  const userRole = req.user.role

  try {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return res.status(404).json({ error: 'Post não encontrado.' })

    // Só autor ou admin pode editar
    if (post.authorId !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para editar este post.' })
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content, published }
    })

    return res.json(updatedPost)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao atualizar post.' })
  }
}

exports.deletePost = async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = req.user.userId
  const userRole = req.user.role

  try {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return res.status(404).json({ error: 'Post não encontrado.' })

    // Só autor ou admin pode excluir
    if (post.authorId !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para excluir este post.' })
    }

    await prisma.post.delete({ where: { id } })
    return res.json({ message: 'Post excluído com sucesso.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao excluir post.' })
  }
}
