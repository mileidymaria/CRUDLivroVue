<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>Lista de livros</h1>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <v-data-table
          dense
          :headers="headers"
          :items="livros"
          item-key="titulo"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title> Livros</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Novo Livro
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="8">
                          <v-text-field
                            v-model="editedItem.titulo"
                            label="Titulo:"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.preco"
                            label="Preco:"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="6" md="2">
                          <v-text-field
                            v-model="editedItem.id"
                            label=" ID"
                            type="number"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="editedItem.isbn"
                            label="Isbn:"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.autor"
                            label="Autor:"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancelar
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Salvar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "LivroCrud",
  data() {
    return {
      search: "",
      headers: [
        { text: "#", value: "id" },
        { text: "Titulo", value: "titulo" },
        { text: "Isbn", value: "isbn" },
        { text: "Preco", value: "preco" },
        { text: "Autor", value: "autor" },
        { text: "Actions", value: "actions", sortable: false },
      ],

      livros: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        titulo: "",
        isbn: "",
        preco: 0,
        autor: "",
      },
      defaultItem: {
        id: 0,
        titulo: "",
        isbn: "",
        preco: 0,
        autor: "",
      },
    };
  },
  methods: {
    inicializa() {
      axios("http://localhost:3000/livros")
        .then((response) => {
          this.livros = response.data;
        })
        .catch((error) => console.log(error));
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      if (this.editedIndex > -1) {
        //alteracao
        axios
          .put(
            "http://localhost:3000/livros/" + this.editedIndex, 
            this.editedItem,
          )
          .then((response) => {
            console.log(response);
            Object.assign(this.livros[this.editedIndex], this.editedItem);
            this.close;
          })
          .catch((error) => console.log(error));
      } else {
        //Inclusao
        axios
          .post("http://localhost:3000/livros", this.editedItem)
          .then((response) => {
            console.log(response);
            this.livros.push(this.editedItem);
            this.close();
          })
          .catch((error) => console.log(error));
      }
    },
    editItem(item) {
      this.editedIndex = this.livros.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.livros.indexOf(item);
      confirm("Deseja apagar este item?") &&
        axios
          .delete("http://localhost:3000/livros/" + item.id)
          .then((response) => {
            console.log(response.data);
            this.livros.splice(index, 1);
          })
          .catch((error) => console.log(error));
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Item" : "Editar Item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.inicializa();
  },
};
</script>