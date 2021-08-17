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

    .answered{
        background-color: green;
    }
</style>

<template>
    <div class="q-pa-md">
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

            <div class="row q-mt-md">
                <div class="col-2">
                    <button @click="getRandomQuestion">Buscar</button>
                </div>
                <div class="col-2">
                    <button @click="nextPlayer">Siguiente Jugador</button>
                </div>
            </div>

            <div class="row q-mt-md">
                <div class="col-12">
                    <h5>Total preguntas: {{ questions.length }}</h5>
                </div>
            </div>

            <div class="row items-start q-mt-md">
                <div class="col-12" v-for="(question) in questions" :key="question.id" :class="[question.status ? 'answered' : '']">
                    <p>{{ question.question }}</p>
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
            <q-card class="bg-primary text-white" v-if="question != null">
                <q-bar>
                <q-space />

                <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                </q-btn>
                </q-bar>

                <q-card-section>
                    <div class="txt-question">{{ question.question }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div class="row">
                        <div class="col-6 answer-container" v-for="(answer, index) in question.answers" :key="index" @click="selectAnswer(answer)">
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

        <q-dialog
            v-model="modalQuestionCategory"
            >
            <q-card style="width: 300px">
                <q-card-section class="q-pt-none">
                    <q-list bordered>
                        <q-item clickable v-ripple v-for="category in showCategories" :key="category.id" @click="selectQuestion(category.question)">
                            <q-item-section>{{ category.name }}</q-item-section>
                            <q-item-section avatar>
                                {{ category.question.score }}
                            </q-item-section>
                        </q-item>
                    </q-list>
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
            modalQuestion: false,

            questions: [],

            question: null,

            correct: false,
            error: false,

            modalQuestionCategory: false,
            showCategories: [],
        }
    },

    created() {
        this.getPlayers()
        this.getCategories()
    },

    watch: {

    },

    methods: {

        selectQuestion(question){
            this.question = question
            this.modalQuestion = true
            this.modalQuestionCategory = false
        },

        getRandomQuestion(){
            // let question = this.questions[Math.floor(Math.random()*this.questions.length)]
            // this.question = question

            this.categories = this.shuffle(this.categories)

            let other = this.categories

            this.showCategories = other.slice(2)

            this.showCategories.forEach(cat => {
                this.questions = this.shuffle(this.questions)

                let found = this.questions.find(doc => doc.category == cat.id)

                cat.question = found
            })

            console.log(this.showCategories);
            this.modalQuestionCategory = true
            
        },

        selectAnswer(answer){
            if (answer.value) {
                this.modalQuestion = false
                this.correct = true

                this.updateUserScore()
                this.updateQuestionStatus()

            }else{
                this.modalQuestion = false
                this.error = true

                if (this.playerIndex < (this.players.length - 1)) {
                    this.playerIndex++
                }else{
                    this.playerIndex = 0
                }

                this.updateQuestionStatus()
            }
        },

        async otherAnswer(){
            if (!this.players[this.playerIndex].powerUp.change) {
                alert('Ya no tienes este power up')
                return
            }

            let question = this.questions[Math.floor(Math.random()*this.questions.length)]
            this.question = question

            this.players[this.playerIndex].powerUp.change = false

            await db.collection('players')
                            .doc(this.players[this.playerIndex].id)
                            .update({ powerUp: { change: this.players[this.playerIndex].powerUp.change, pass: this.players[this.playerIndex].powerUp.pass } })
        },

        async passAnswer(){
            if (!this.players[this.playerIndex].powerUp.pass) {
                alert('Ya no tienes este power up')
                return
            }
            this.players[this.playerIndex].powerUp.pass = false

            await db.collection('players')
                            .doc(this.players[this.playerIndex].id)
                            .update({ powerUp: { change: this.players[this.playerIndex].powerUp.change, pass: this.players[this.playerIndex].powerUp.pass } })
        
            this.modalQuestion = false
            this.nextPlayer()

            this.modalQuestion = false
        },

         nextPlayer(){
            if (this.playerIndex < (this.players.length - 1)) {
                this.playerIndex++
            }else{
                this.playerIndex = 0
            }
            
        },

        async updateQuestionStatus(){
            try {
                this.question.status = true

                let response = await db.collection('questions')
                                        .doc(this.question.id)
                                        .update({ status: true })


                let index = this.questions.findIndex(doc => doc.id == this.question.id)
                this.questions.splice(index, 1)

                // this.nextPlayer()
            } catch (error) {
                console.log(error);
            }
        },


        async updateUserScore(){
            try {
                this.players[this.playerIndex].score = this.players[this.playerIndex].score + this.question.score

                let response = await db.collection('players')
                                        .doc(this.players[this.playerIndex].id)
                                        .update({ score: this.players[this.playerIndex].score })

                if (this.playerIndex < (this.players.length - 1)) {
                    this.playerIndex++
                }else{
                    this.playerIndex = 0
                }


            } catch (error) {
                console.log(error);
            }
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

                                                this.categories.push(categorie)
                                                this.shuffle(this.categories)

                                                
                                                
                                            })
                                        })
                this.getQuestions()
            } catch (error) {
                console.log(error);
            }
        },

        async getQuestions(){
            try {
                this.questions = []

                let response = await db.collection('questions')
                                        .where('status', '==', false)
                                        .get()
                                        .then(query => {
                                            query.forEach(doc => {
                                                let question = doc.data()
                                                question.id = doc.id

                                                this.questions.push(question)
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

