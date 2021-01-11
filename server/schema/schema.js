const graphql = require('graphql');
const {
  GraphQLSchema, GraphQLObjectType,
  GraphQLString, GraphQLID, GraphQLInt, GraphQLList,
  GraphQLNonNull,
} = graphql;
const mysql = require('mysql');
const createMySQLWrap = require('mysql-wrap');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});
const sql = createMySQLWrap(connection);
if ( sql ) console.log('MySQL active.');

sql.query(`
  CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    genre VARCHAR(10),
    authorId INT(2)
  )
`);

sql.query(`
  CREATE TABLE IF NOT EXISTS authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT(2)
  )
`);

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID, },
    name: { type: GraphQLString, },
    genre: { type: GraphQLString, },
    author: {
      type: AuthorType,
      async resolve(parent, args){
        return await sql.selectOne('authors', { id: parent.authorId });
      }
    }
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID, },
    name: { type: GraphQLString, },
    age: { type: GraphQLInt, },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args) {
        return await sql.select('books', { authorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID, }, },
      async resolve(parent, args) {
        return await sql.selectOne('books', args);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID, }, },
      async resolve(parent, args) {
        return await sql.selectOne('authors', args);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return sql.select('books');
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return sql.select('authors');
      }
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString), },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return new Promise(resolve => {
          sql.insert('authors', {
            name: args.name,
            age: args.age,
          }).then(result => {
            resolve(args);
          });
        });
      },
    },

    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString), },
        genre: { type: new GraphQLNonNull(GraphQLString), },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return new Promise(resolve => {
          sql.insert('books', {
            name: args.name,
            genre: args.genre,
            authorId: args.authorId,
          }).then(result => {
            resolve(args);
          });
        });
      },
    }
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
