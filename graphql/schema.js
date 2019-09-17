const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Materiel {
        _id: ID!
        marque: String!
        reference_model: String! 
        annee:String!
        puissance:String!
        nombre_heures:Int!
        Etat_general:String!
        Pneus_avant:String!
        imgBytedata:String!
      
   
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Materiel !]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        marque:String!
        reference_model:String! 
        annee:Int!
        puissance:String!
        nombre_heures:Int!
        Etat_general:String!
        Pneus_avant:String
        imgBytedata:String
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        getPost(postId:ID!):Materiel!
        postes(page:Int):Materiel!

    }

    type RootMutation {
        createUser(userInput: UserInputData):User!
        createPost(postInput: PostInputData):Materiel!
        updatePost(id: ID!, postInput: PostInputData):Materiel!
        deletePost(id:ID!):Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
