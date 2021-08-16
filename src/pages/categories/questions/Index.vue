<style lang="scss" scoped>
    .active{
        background-color: green;
    }

    .question{
        width: 100%;
        background-color: lightgray;
        cursor: pointer;
    }

    .answered{
        background-color: lightgreen;
    }
</style>

<template>
    <div class="q-pa-md">
        <div class="row">
            <div class="col-12">
                <button @click="resetQuestions">Reinciar todas las preguntas</button>
                <span style="font-weight: bold; margin-left: 20px;"> - {{ questions.length }}</span>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <q-input v-model="newQuestion.question" type="text" label="Pregunta" />

                <div class="col-12 q-mt-md">
                    <div class="row">
                        <div class="col-6">
                            <q-input v-model="answer1.answer" type="text" label="Respuesta" filled style="background-color: green;" />
                        </div>
                        <div class="col-6">
                            <q-input v-model="answer2.answer" type="text" label="Respuesta" filled />
                        </div>
                        <div class="col-6">
                            <q-input v-model="answer3.answer" type="text" label="Respuesta" filled  />
                        </div>
                        <div class="col-6">
                            <q-input v-model="answer4.answer" type="text" label="Respuesta" filled />
                        </div>
                    </div>
                </div>
                <div class="col-12 q-mt-md">
                    <q-select v-model="newQuestion.score" :options="[1, 2, 3, 4, 5]" label="Valor" filled />
                </div>
            </div>
            <div class="col-12">
                <q-btn v-if="!editQuestionValue" class="q-mt-sm" color="primary" icon="check" label="Registrar" @click="registerQuestion" />
                <div v-else>
                    <q-btn class="q-mt-sm" color="primary" icon="check" label="Actualizar" @click="updateQuestion" />
                    <q-btn class="q-mt-sm q-ml-sm" color="primary" icon="cancel" label="Cancelar" @click="cancelEdit" />
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12 q-mt-md">

                <div :class="[question.status ? 'answered' : '']" class="question" v-for="(question, index) in questions" :key="question.id" @click="editQuestion(question, index)">
                    <p>{{ question.question }} <span style="font-weight: bold;">({{ question.score }})</span> </p>
                    <ul>
                        <li v-for="(answer, index) in question.answers" :key="index">
                            <span :class="[ answer.value ? 'active' : '' ]">{{ answer.answer }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { firebase, db, firestore, storage } from 'boot/firebase'

export default {
    name: 'Questions',

    props: [
        'id'
    ],

    data(){
        return{
            category: null,

            newQuestion: {
                question: '',
                category: '',
                status: false,
                score: 1,
            },

            answer1: {
                answer: '',
                value: true,
            },
            answer2: {
                answer: '',
                value: false,
            },
            answer3: {
                answer: '',
                value: false,
            },
            answer4: {
                answer: '',
                value: false,
            },

            questions: [],

            editId: null,

            editQuestionValue: false,
            editIndex: null,
        }
    },

    mounted() {
        this.getCategory()
    },

    methods: {
        async resetQuestions(){
            try {
                this.questions.forEach(async doc => {
                    doc.status = false
                    await db.collection('questions')
                            .doc(doc.id)
                            .update({ status: false })

                            
                })
            } catch (error) {
                console.log(error);
            }
        },

        async getCategory(){
            try {
                let response = await db.collection('categories').doc(this.id).get()

                if (response.exists) {
                    this.category = response.data()

                    this.getQuestions()
                }
            } catch (error) {
                console.log(error);
            }
        },

        cancelEdit(){

                this.newQuestion = {
                    question: '',
                    category: '',
                    status: false,
                    score: 1
                }

                this.answer1 = {
                    answer: '',
                    value: true,
                }

                this.answer2 = {
                    answer: '',
                    value: false,
                }

                this.answer3 = {
                    answer: '',
                    value: false,
                }

                this.answer4 = {
                    answer: '',
                    value: false,
                }

                this.editQuestionValue = false
        },

        async updateQuestion(){
            try {
                this.newQuestion.category = this.id
                this.newQuestion.answers = [
                    this.answer1,
                    this.answer2,
                    this.answer3,
                    this.answer4,
                ]

                let response = await db.collection('questions')
                                        .doc(this.editId)
                                        .update(this.newQuestion)

                let question = JSON.parse(JSON.stringify(this.newQuestion))
                question.id = this.editId

                this.questions.splice(this.editIndex, 1)
                this.questions.push(question)

                this.newQuestion = {
                    question: '',
                    category: '',
                    status: false,
                    score: 1
                }

                this.answer1 = {
                    answer: '',
                    value: true,
                }

                this.answer2 = {
                    answer: '',
                    value: false,
                }

                this.answer3 = {
                    answer: '',
                    value: false,
                }

                this.answer4 = {
                    answer: '',
                    value: false,
                }

                this.editQuestionValue = false
                                        
            } catch (error) {
                console.log(error);
            }
        },

        async registerQuestion(){
            try {
                this.newQuestion.category = this.id
                this.newQuestion.answers = [
                    this.answer1,
                    this.answer2,
                    this.answer3,
                    this.answer4,
                ]

                let response = await db.collection('questions')
                                        .add(this.newQuestion)
                                        .then(docRef => {
                                            let question= JSON.parse(JSON.stringify(this.newQuestion))
                                            question.id = docRef.id

                                            
                                            this.questions.push(question)

                                            this.newQuestion = {
                                                question: '',
                                                category: '',
                                            }

                                            this.answer1 = {
                                                answer: '',
                                                value: true,
                                            }

                                            this.answer2 = {
                                                answer: '',
                                                value: false,
                                            }

                                            this.answer3 = {
                                                answer: '',
                                                value: false,
                                            }

                                            this.answer4 = {
                                                answer: '',
                                                value: false,
                                            }
                                        })
            } catch (error) {
                console.log(error);
            }
        },

        async getQuestions(){
            try {
                let response = await db.collection('questions')
                                        .where('category', '==', this.id)
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

        editQuestion(question, index){
            try {

                this.editId = question.id
                this.editIndex = index

                this.newQuestion.question = question.question
                this.newQuestion.score = question.score
                this.newQuestion.status = question.status
                

                this.answer1 = question.answers[0]
                this.answer2 = question.answers[1]
                this.answer3 = question.answers[2]
                this.answer4 = question.answers[3]

                this.editQuestionValue = true
            } catch (error) {
                console.log(error);
            }
        }
    },
}
</script>