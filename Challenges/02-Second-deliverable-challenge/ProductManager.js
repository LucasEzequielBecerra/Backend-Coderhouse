const fs = require('fs')

class ProductManager {
    constructor() {
        this.path = './products.json'
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, 'utf-8')

                return JSON.parse(products)

            } else {
                return []
            }

        } catch (error) {
            console.log(error)
        }

    }

    async addProduct(obj) {
        try {
            const product = {
                id: await this.idGenerator(),
                ...obj
            }
            const productsFile = await this.getProducts()
            productsFile.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(productsFile, null, 2))
        } catch (error) {
            console.log(error)
        }
    }

    async getProductById(prodId) {
        try {
            const productsFile = await this.getProducts()
            const productFinded = productsFile.find(p => p.id === prodId)
            return productFinded ? productFinded : false
        } catch (err) {
            console.log(err)
        }
    }

    async deleteProduct(prodId) {
        try {
            const productsFile = await this.getProducts()
            if (typeOf(await this.getProductById(prodId)) === 'object') {
                const productsNotRemoved = productsFile.filter((prod) => prod.id !== prodId)
                await fs.promises.writeFile(this.path, JSON.stringify(productsNotRemoved, null, 2))
                // console.log(productsNotRemoved)
                return productsNotRemoved
            } else {
                return 'El producto con el id seleccionado, no existe'
            }
        } catch (err) {
            console.log(err)
        }
    }

    async updateProduct(prodId, field) {
        try {
            const productFile = await this.getProductById(prodId)
            if (typeof (productFile) === 'object') {
                const modifiedProduct = { ...productFile, ...field, id: prodId }
                const productsFileToUpdated = await this.deleteProduct(prodId)
                productsFileToUpdated.push(modifiedProduct)
                await fs.promises.writeFile(this.path, JSON.stringify(productsFileToUpdated, null, 2))
            } else {
                return 'El producto con el id seleccionado, no existe'
            }
        } catch (err) {
            console.log(err)
        }


    }

    async idGenerator() {
        let newId = 1
        const productsFile = await this.getProducts()
        productsFile.map((prod) => {
            if (prod.id <= newId) newId++
        })
        return newId
    }


}

const productManager = new ProductManager()

const obj1 = {
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25

}

const test = async () => {

    console.log('first request -------->', await productManager.getProductById(3))
    // await productManager.addProduct(obj1)
    // await productManager.addProduct(obj1)
    // console.log('second request -------->', await productManager.getProducts())
    // console.log('ask by id -------->', await productManager.getProductById(55))

    // await productManager.addProduct(obj1)
    // await productManager.updateProduct(4, { title: 'lol' })
    // console.log(await productManager.deleteProduct(1))
    // console.log('first request -------->', await productManager.getProducts())


}
test()
// export default productManager
// module.exports(ProductManager)