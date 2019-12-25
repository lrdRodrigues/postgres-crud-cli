const InterfaceCrud = require('../../db/interface/InterfaceCrud')
const Sequelize = require('sequelize')

// host, dialect, quoteIdentifiers, operatorAliases 

class PostgresStrategy extends InterfaceCrud {
    constructor() {
        super() 
        this._banco = null
        this._driver = null
        this._connect() 
    }

    async create(item) {
        const {dataValues}  = await this._banco.create(item) 
        return dataValues 
    }

    async delete(id){
        return await this._banco.destroy({where: {'id': id}})
    }
    
    async read(query = {}){
        // console.log('nome', nome) 
        const [{dataValues}] = await this._banco.findAll({where: query, rawQuery: true})
        const result = dataValues
        return result
    }

    async update(id, item){
        const result = await this._banco.update( item, { where:{id: id}} )
        return result 
    }

    async isConnected(){
        try{
            await this._driver.authenticate() 
            return true;             
        }catch(error){
            console.log('Error Authenticating Sequelize', error)
            return false; 
        }
    }

    async _connect() {
        this._driver = new Sequelize('heroes', 'rogeriorodrigues', 'senhasupersecreta', {
            host: 'localhost',
            dialect: 'postgres',
            quoteIdentifiers: false,
            operatorAliases: false
        })

        await this._modelDatabase() 
    }

    async _modelDatabase() {
        this._banco = this._driver.define('Games',
            {
                id: {
                    type: Sequelize.INTEGER,
                    required: true,
                    autoIncrement: true,
                    primaryKey: true
                },
                nome: {
                    type: Sequelize.INTEGER,
                    required: true
                },
                genero: {
                    type: Sequelize.INTEGER,
                    required: true
                }
            },
            {
                tableName: 'TB_GAMES',
                freezeTableName: false,
                timestamps: false
            }
        )

        await this._banco.sync() 
    }
}

module.exports = PostgresStrategy