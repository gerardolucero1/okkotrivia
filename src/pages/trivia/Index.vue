<style lang="scss" scoped>
    .my-card{
        width: 250px;
        max-width: 250px;
        height: 250px;
    }

    .powers{
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        span{
            width: 30px;
            height: 30px;
            font-size: 20px;
            
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .power-container:hover{
        background-color: rgb(4, 56, 4);
    }

    .active{
        background-color: green;
    }

    .no-active{
        background-color: red;
    }

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

    .txt-question{
        font-size: 45px;
    }

    .answer-container{
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 25px;
        cursor: pointer;
    }

    .answer-container:hover{
        background-color: lightgray;
    }

    .power-container{
        height: 100px;
        display: flex;
        justify-content: center;
        
        align-items: center;
        font-weight: bold;
        font-size: 25px;
        cursor: pointer;
    }

    .score-indicator{
        font-size: 25px;
        font-weight: bold;
    }

    .score-container{
        width: 100%;
        height: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 38px;
        font-weight: bold;
        flex-direction: column;

        span{
            font-size: 50px;
        }
    }

    .counter-section{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 70px;
        font-weight: bold;
    }
</style>

<template>
    <div class="q-pa-md">
        <div class="q-mb-md">
            <button @click="nextPlayer">Siguiente jugador</button>
        </div>
        <div>
            <div class="row">
                <div class="col-4">
                    <q-card class="my-card" v-if="players.length != 0">
                        <div class="powers">
                            <span :class="[ players[playerIndex].powerUp.change ? 'active' : 'no-active' ]">
                                <q-icon name="autorenew" />
                            </span>
                            <span style="margin-top: 5px;" :class="[ players[playerIndex].powerUp.pass ? 'active' : 'no-active' ]">
                                <q-icon name="not_interested" />
                            </span>
                        </div>
                        <q-img :src="players[playerIndex].photo" width="250px" height="250px">
                            
                            <div class="absolute-bottom text-subtitle2 text-center">
                                {{ players[playerIndex].name }}
                            </div>
                        </q-img>
                    </q-card>
                </div>
                <div class="col-8">
                    <div class="score-container" v-if="players.length != 0">
                        <p>Puntuacion:</p>
                        <span>{{ players[playerIndex].score }}</span>
                    </div>
                </div>
            </div>

            <div class="row items-start q-mt-md">
                <div class="col-md-6 categorie" v-for="(category, index) in categories" :key="category.id" v-show="index < 2">
                    <button style="z-index: 1;" class="absolute-top score-indicator">
                        {{ category.question.score }}
                    </button>
                    
                    <div class="sub-categorie" :style="{ backgroundColor: category.color}" @click="showQuestion(category)">
                        
                        <span>{{ category.name }}</span>
                    </div>
                    
                </div> 
                    
            </div>
        </div>

        <q-dialog
            v-model="modalQuestion"
            persistent
            :maximized="true"
            transition-show="slide-up"
            transition-hide="slide-down"
            >
            <q-card class="bg-primary text-white">
                <q-bar>
                <q-space />

                <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                </q-btn>
                </q-bar>

                <q-card-section>
                    <div class="txt-question">{{ category.question.question }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div class="row">
                        <div class="col-6 answer-container" v-for="(answer, index) in category.question.answers" :key="index" @click="selectAnswer(answer, category.question)">
                            <span>{{ answer.answer }} - {{ answer.value }}</span>
                        </div>
                    </div>
                </q-card-section>

                <q-card-section>
                    <div class="row">
                        <div class="col-6 power-container" :class="[ players[playerIndex].powerUp.change ? 'active' : 'no-active' ]" @click="otherAnswer">
                            Otra pregunta
                        </div>
                        <div class="col-6 power-container" :class="[ players[playerIndex].powerUp.pass ? 'active' : 'no-active' ]" @click="passAnswer">
                            Paso
                        </div>
                    </div>
                </q-card-section>

                <q-card-section>
                    <div class="row">
                        <div class="col-12 counter-section">
                            <span v-show="showCounter">{{ counter }}</span>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>

        <q-dialog
            v-model="correct"
            >
            <q-card style="width: 300px">
                <q-card-section>
                <div class="text-h6">Correcto!!!!</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    Respuesta correcta
                </q-card-section>

                <q-card-actions align="right" class="bg-white text-teal">
                    <q-btn flat label="OK" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog
            v-model="error"
            >
            <q-card style="width: 300px">
                <q-card-section>
                <div class="text-h6">Incorrecto!!!!</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    Respuesta incorrecta
                </q-card-section>

                <q-card-actions align="right" class="bg-white text-teal">
                    <q-btn flat label="OK" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { firebase, db, firestore, storage } from 'boot/firebase'

export default {
    name: 'Trivia',

    data(){
        return{
            players: [],
            categories: [],

            playerIndex: 0,

            start: true,

            category: null,

            modalQuestion: false,
            correct: false,
            error: false,
            counter: 5,
            interval: null,

            showCounter: false
        }
    },

    created() {
        this.getPlayers()
        this.getCategories()
    },

    watch: {
        modalQuestion(){
            if (this.modalQuestion) {
                this.startCron()
            }else{
                this.modalQuestion = false
                clearInterval(this.interval)

                this.counter = 5
                this.showCounter = false
            }
        },

        counter(){
            if (this.counter == 0) {
                // this.modalQuestion = false
                clearInterval(this.interval)

                this.counter = 5
                this.showCounter = false

                // this.nextPlayer()
            }
        }
    },

    methods: {
        startCron(){
            
            setTimeout(() => {
                console.log('Comienza cuenta');
                this.showCounter = true
                this.interval = setInterval(() => {
                    this.counter--
                }, 1000);
            }, 7000)
        },

        selectAnswer(answer, question){
            if (answer.value) {
                this.modalQuestion = false
                this.correct = true

                this.updateUserScore()
                this.updateQuestionStatus(question)

                clearInterval(this.interval)

                this.counter = 5
                this.showCounter = false
            }else{
                this.modalQuestion = false
                this.error = true

                if (this.playerIndex < (this.players.length - 1)) {
                    this.playerIndex++
                }else{
                    this.playerIndex = 0
                }

                clearInterval(this.interval)

                this.counter = 5
                this.showCounter = false

                this.getCategories()
                this.updateQuestionStatus(question)
            }
        },

        async updateQuestionStatus(answer){
            try {
                let response = await db.collection('questions')
                                        .doc(answer.id)
                                        .update({ status: true })
            } catch (error) {
                console.log(error);
            }
        },

        nextPlayer(){
            clearInterval(this.interval)

            this.counter = 5
            this.showCounter = false

            this.modalQuestion = false
            if (this.playerIndex < (this.players.length - 1)) {
                this.playerIndex++
            }else{
                this.playerIndex = 0
            }
            

            this.getCategories()
        },

        async passAnswer(){
            try {
                if (!this.players[this.playerIndex].powerUp.pass) {
                    return
                }

                clearInterval(this.interval)

                this.counter = 5
                this.showCounter = false

                this.modalQuestion = false

                this.players[this.playerIndex].powerUp.pass = false

                await db.collection('players')
                                .doc(this.players[this.playerIndex].id)
                                .update({ powerUp: { change: this.players[this.playerIndex].powerUp.change, pass: this.players[this.playerIndex].powerUp.pass } })
            
                this.modalQuestion = false
                if (this.playerIndex < (this.players.length - 1)) {
                    this.playerIndex++
                }else{
                    this.playerIndex = 0
                }

                this.getCategories()
            } catch (error) {
                console.log(error);
            }
        },

        async otherAnswer(){
            try {
                if (!this.players[this.playerIndex].powerUp.change) {
                    return
                }

                this.showCounter = false
                clearInterval(this.interval)

                this.counter = 5

                this.startCron()

                let question = await db.collection('questions')
                                .where('category', '==', this.category.id)
                                .where('status', '==', false)
                                .where('question', '!=', this.category.question.question)
                                .limit(1)
                                .get()
                                .then(query => {
                                    query.forEach(async que => {
                                        let document = que.data()
                                        document.id = que.id

                                        this.shuffle(document.answers)

                                        this.category.question = document
                                        this.players[this.playerIndex].powerUp.change = false

                                        await db.collection('players')
                                                        .doc(this.players[this.playerIndex].id)
                                                        .update({ powerUp: { change: this.players[this.playerIndex].powerUp.change, pass: this.players[this.playerIndex].powerUp.pass } })
                                    })
                                })
            } catch (error) {
                console.log(error);
            }
        },

        async updateUserScore(){
            try {
                this.players[this.playerIndex].score = this.players[this.playerIndex].score + this.category.question.score

                let response = await db.collection('players')
                                        .doc(this.players[this.playerIndex].id)
                                        .update({ score: this.players[this.playerIndex].score })

                if (this.playerIndex < (this.players.length - 1)) {
                    this.playerIndex++
                }else{
                    this.playerIndex = 0
                }

                this.getCategories()
            } catch (error) {
                console.log(error);
            }
        },

        showQuestion(category){
            this.modalQuestion = true
            this.category = category
        },

        shuffle(array) {
            var currentIndex = array.length,  randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
            }

            return array;
        },

        async getPlayers(){
            try {
                let response = await db.collection('players')
                                        .get()
                                        .then( query => {
                                            query.forEach(doc => {
                                                let player = doc.data()
                                                player.id = doc.id

                                                this.players.push(player)
                                            })         
                                        })
            } catch (error) {
                console.log(error);
            }
        },

        async getCategories(){
            try {
                this.categories = []

                let response = await db.collection('categories')
                                        .get()
                                        .then(query => {
                                            query.forEach(async doc => {
                                                let categorie = doc.data()
                                                categorie.id = doc.id

                                                let question = await db.collection('questions')
                                                                        /* .where('random', '>=', random) */
                                                                        .where('category', '==', categorie.id)
                                                                        .where('status', '==', false)
                                                                        /* .orderBy('random') */
                                                                        .limit(1)
                                                                        .get()
                                                                        .then(query => {
                                                                            query.forEach(que => {
                                                                                let document = que.data()
                                                                                document.id = que.id

                                                                                this.shuffle(document.answers)

                                                                                categorie.question = document

                                                                                this.categories.push(categorie)

                                                                                this.shuffle(this.categories)
                                                                            })
                                                                        })

                                                
                                            })
                                        })

            } catch (error) {
                console.log(error);
            }
        },

        startGame(){
            this.start = true
            /* this.$q.fullscreen.request()
                .then(() => {
                // success!
                })
                .catch(err => {
                // oh, no!!!
                }) */
        }
    }
}
</script>

