<style lang="scss" scoped>
    .categorie{
        position: relative;
        min-height: 100px;
        padding: 10px;

        a{
            text-decoration: none;
        }
        
        span{
            font-weight: bold;
            font-size: 30px;
        }

        .sub-categorie{
            width: 100%;
            height: calc(100px - 20px);
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            cursor: pointer;
        }
    }
</style>

<template>
    <div class="q-pa-md">
        <div class="row">
            <div class="col-12">
                <q-input v-model="newCategory.name" type="text" label="Nombre de la categoria" />
            </div>
            <div class="col-12">
                <q-btn class="q-mt-sm" color="primary" icon="check" label="Registrar" @click="registerCategory" />
            </div>
        </div>

        <div class="row items-start q-mt-md">
            <div class="col-md-4 categorie" v-for="(categorie, index) in categories" :key="categorie.id">
                <button @click="deleteCategorie(categorie.id, index)" style="z-index: 1000000;" class="absolute-top">
                    <q-icon name="cancel" />
                </button>
                <router-link :to="`/categories/${categorie.id}/questions`">
                    <div class="sub-categorie" :style="{ backgroundColor: categorie.color}" @click="goToCategorie(categorie.id)">
                    
                        <span>{{ categorie.name }}</span>
                    </div>
                </router-link>
                
                
            </div>
        </div>
    </div>
</template>

<script>
import { firebase, db, firestore, storage } from 'boot/firebase'

export default {
    name: 'Categories',

    data(){
        return{
            newCategory: {
                name: '',
                color: ''
            },

            categories: [],

            palette: [
                '#FF5AC4', '#FF168A', '#BB3354', '#7F5347',
                '#FF652E', '#FFCB00', '#CAB641', '#9CD325',
                '#047F4D', '#0086C0', '#579BFC', '#66CCFF',
                '#A25DDC', '#784BD1', '#808080', '#333333',
                '#FF7575', '#FAA1F1', '#FFADAD', '#9AADBD',
                '#68A1BD', '#225091', '#4ECCC6', '#5559DF',
                '#401794', '#563E3D', '#BDA8F9', '#2B76E5',
                '#A9BEE8', '#D974B0', '#9D99B9', '#AD967A',
                '#A1E3F6', '#BD816F', '#175A63'
            ]
        }
    },

    created() {
        this.getCategories()
    },

    methods: {
        async getCategories(){
            try {
                let response = await db.collection('categories')
                                        .get()
                                        .then(query => {
                                            query.forEach(doc => {
                                                let categorie = doc.data()
                                                categorie.id = doc.id

                                                this.categories.push(categorie)
                                            })
                                        })
            } catch (error) {
                console.log(error);
            }
        },

        async registerCategory(){
            try {
                let color = this.palette[Math.floor(Math.random() * this.palette.length)]

                this.newCategory.color = color

                let response = await db.collection('categories')
                                    .add(this.newCategory)
                                    .then(docRef => {
                                        let categorie = JSON.parse(JSON.stringify(this.newCategory))
                                        categorie.id = docRef.id

                                        this.categories.push(categorie)

                                        this.newCategory = {
                                            name: '',
                                            color: ''
                                        }
                                    })
            } catch (error) {
                console.log(error);
            }
        },

        async deleteCategorie(id, index){
            try {
                let response = await db.collection('categories').doc(id).delete()

                this.categories.splice(index, 1)
            } catch (error) {
                console.log(error);
            }
        },

        goToCategorie(id){
            this.$router.push('/questions', {
                params: {
                    id: id,
                }
            })
        }
    },
}
</script>