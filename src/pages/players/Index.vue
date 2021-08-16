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
        z-index: 10000;
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

    .active{
        background-color: green;
    }

    .no-active{
        background-color: red;
    }
</style>

<template>
    <div class="q-pa-md">
        <div class="row">
            <div class="col-12">
                <q-input v-model="newPlayer.name" type="text" label="Nombre del jugador" />
            </div>
            <div class="col-12">
                <q-radio v-model="newPlayer.genere" val="male" label="Masculino" />
                <q-radio v-model="newPlayer.genere" val="female" label="Femenino" />
                <br>
                <q-btn class="q-mt-sm" color="primary" icon="check" label="Registrar" @click="registerPlayer" />
            </div>
        </div>
        <div class="row items-start q-gutter-md q-mt-md">
            <q-card class="my-card" v-for="(player, index) in players" :key="player.id">
                <button @click="deletePlayer(player.id, index)" style="z-index: 1000000;" class="absolute-top">
                    <q-icon name="cancel" />
                </button>

                <div class="powers">
                    <span :class="[ player.powerUp.change ? 'active' : 'no-active' ]">
                        <q-icon name="autorenew" />
                    </span>
                    <span style="margin-top: 5px;" :class="[ player.powerUp.pass ? 'active' : 'no-active' ]">
                        <q-icon name="not_interested" />
                    </span>
                </div>
                <q-img :src="player.photo" width="250px" height="250px">
                    
                    <div class="absolute-bottom text-subtitle2 text-center">
                        {{ player.name }} - {{ player.score }}
                    </div>
                </q-img>
            </q-card>
        </div>

        <div class="row q-mt-md">
            <div class="col-12">
                <button @click="resetPowerUp">Reinciar power up</button>
                <button @click="resetScore">Reinciar puntuacion</button>
            </div>
        </div>
    </div>
</template>

<script>
import { firebase, db, firestore, storage } from 'boot/firebase'

export default {
    name: 'Players',

    data(){
        return{
            newPlayer: {
                photo: '',
                genere: 'male',
                name: '',
                score: 0,
                powerUp: {
                    change: true,
                    pass: true,
                }
            },

            players: [],
        }
    },

    created() {
        this.getPlayers()
    },

    computed: {
        
    },

    methods: {
        async getPlayers(){
            try {
                let response = await db.collection('players')
                                        .get()
                                        .then( query => {
                                            query.forEach(doc => {
                                                let player = doc.data()
                                                player.id = doc.id

                                                this.players.push(player)

                                                this.players.sort((a,b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0))
                                            })         
                                        })
            } catch (error) {
                console.log(error);
            }
        },

        async registerPlayer(){
            try {
                if (this.newPlayer.name == '') {
                    this.$q.notify({
                        type: 'negative',
                        message: 'Error',
                    })

                    return
                }

                if (this.newPlayer.genere == 'male') {
                    this.newPlayer.photo = 'https://th.bing.com/th/id/R.b1813813663c2b8847536d5b4b4cf1d9?rik=k5VCQpnBsY87pA&pid=ImgRaw&r=0'
                }else{
                    this.newPlayer.photo = 'https://www.dheka.com.br/site/wp-content/uploads/2019/10/depoimento-avatar-feminino.jpg'
                }
                let response = await db.collection('players')
                                        .add(this.newPlayer)
                                        .then(docRef => {
                                            let player = JSON.parse(JSON.stringify(this.newPlayer))
                                            player.id = docRef.id

                                            this.players.push(player)

                                            this.newPlayer = {
                                                photo: '',
                                                genere: 'male',
                                                name: '',
                                                score: 0,
                                                powerUp: {
                                                    change: true,
                                                    pass: true,
                                                }
                                            }
                                        })
            } catch (error) {
                console.log(error);
            }
        },

        async resetPowerUp(){
            try {
                this.players.forEach(async doc => {
                    doc.powerUp.change = true
                    doc.powerUp.pass = true

                    await db.collection('players').doc(doc.id).update({ powerUp: { change: true, pass: true } })
                })
            } catch (error) {
                console.log(error);
            }
        },

        async resetScore(){
            try {
                this.players.forEach(async doc => {
                    doc.score = 0

                    await db.collection('players').doc(doc.id).update({ score: 0 })
                })
            } catch (error) {
                console.log(error);
            }
        },

        async deletePlayer(id, index){
            try {
                let response = await db.collection('players').doc(id).delete()

                this.players.splice(index, 1)
            } catch (error) {
                console.log(error);
            }
        }
    },
}
</script>