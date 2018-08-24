<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar color="gray">
            <v-toolbar-title color>Добавление нового пользователя</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" validation>
              <v-layout row wrap>
                <v-flex xs12 sm4 pa-1>
                  <v-text-field
                    name="sname"
                    label="Фамилия"
                    type="text"
                    required
                    :rules="[v => !!v || 'Фамилия обязательное поле !']"
                    @keydown="onlyLetters"
                    v-model="sname">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm4 pa-1>
                  <v-text-field
                    name="name"
                    label="Имя"
                    type="text"
                    required
                    :rules="[v => !!v || 'Имя обязательное поле !']"
                    @keydown="onlyLetters"
                    v-model="name">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm4 pa-1>
                  <v-text-field
                    name="fname"
                    label="Oтчество"
                    type="text"
                    required
                    :rules="[v => !!v || 'Отчество обязательное поле !']"
                    @keydown="onlyLetters"
                    v-model="fname">
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm4 pa-1 d-flex>
                  <v-select
                    :items="documentType"
                    item-text="description"
                    item-value="type"
                    v-model="documentSelectedType"
                    label="Тип паспорта"
                  ></v-select>{{documentSelectedType}}/{{currentDocType === 'foreigner'}}
                </v-flex>
                <template v-if="currentDocType === 'rus'">
                  <v-flex xs12 sm4 pa-1 d-flex>
                    <v-text-field
                      name="serieRus"
                      label="Серия паспорта Rus"
                      type="text"
                      v-mask="'####'"
                      v-if="currentDocType !== 'foreigner'"
                      v-model="serieRus">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 pa-1 d-flex>
                    <v-text-field
                      name="docNumberRus"
                      label="Номер паспорта"
                      type="text"
                      v-mask="'######'"
                      v-model="docNumberRus">
                    </v-text-field>
                  </v-flex>
                </template>
                <template v-else-if="currentDocType === 'foreigner'">
                  <v-flex xs12 sm4 pa-1 d-flex>
                    <v-text-field
                      name="serie"
                      label="Серия паспорта Not rus"
                      type="text"
                      v-model="serie">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 pa-1 d-flex>
                    <v-text-field
                      name="docNumber"
                      label="Номер паспорта Not Rus"
                      type="text"
                      v-model="docNumber">
                    </v-text-field>
                  </v-flex>
                </template>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm4 pa-1 d-flex>
                  <v-text-field
                    name="email"
                    label="Емейл"
                    type="text"
                    :rules="[v => emailReg.test(v) || 'Недопустимые символы']"
                    v-model="email">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm4 pa-1 d-flex>
                  <v-text-field
                    name="phone"
                    label="Телефон"
                    type="tel"
                    v-mask="'+# (###) ###-####'"
                    :rules="[v => !!v || 'Телефон обязательное поле !']"
                    v-model="phone"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm4 pa-1>
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu1"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="birthDate"
                      label="Дата рождения"
                      prepend-icon="event"
                      :rules="[v => !!v || 'Дата рождения обязательное поле !']"
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      ref="picker"
                      v-model="birthDate"
                      :max="new Date().toISOString().substr(0, 10)"
                      min="1950-01-01"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm4 pa-1 d-flex>
                  <v-select
                    :items="groupType"
                    :rules="[v => !!v || 'Группы обязательное поле !']"
                    label="Группы пользователя"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm4 pa-1>
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu2"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="workDate"
                      label="Дата трудоустройства"
                      prepend-icon="event"
                      readonly
                      :rules="[v => !!v || 'Дата трудоустройства обязательное поле !']"
                    ></v-text-field>
                    <v-date-picker
                      ref="picker"
                      v-model="workDate"
                      :max="new Date().toISOString().substr(0, 10)"
                      min="1950-01-01"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm4 pa-1 d-flex>
                  <v-select
                    :items="statusType"
                    :rules="[v => !!v || 'Статус обязательное поле !']"
                    label="Статус"
                  ></v-select>
                </v-flex>
              </v-layout>

            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              :disabled="!valid"
              @click=""
            >Очистить
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!valid"
              @click=""
            >Продолжить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mask} from 'vue-the-mask'

  export default {
    name: "NewUser",
    directives: {mask},
    data() {
      return {
        valid: false,
        name: '',
        sname: '',
        fname: '',
        documentSelectedType: null,
        serieRus: null,
        docNumberRus: null,
        serie: null,
        docNumber: null,
        currentDocType: null,
        phone: '',
        email: '',
        menu1: false,
        birthDate: '',
        menu2: false,
        workDate: '',
        group: '',
        documentType: [
          {type: 'rus', description: 'Паспорт гражданина РФ'},
          {type: 'foreigner', description: 'Паспорт иностранного гражданина'}
        ],
        groupType: [
          'Суперпользователь', 'Модератор', 'Менеджер', 'PM', 'ВРМ'
        ],
        statusType: [
          'Активен', 'Собеседование', 'Отпуск', 'Отгул', 'Командировка'
        ],
        emailReg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      }
    },
    watch: {
      documentSelectedType: function (val) {
        console.log('Changed', val);
        this.currentDocType = val;
      }
    },
    methods: {
      onlyLetters(evt) {
        let charCode = event.keyCode;

        if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8) {
          return;
        } else {
          evt.preventDefault();
          return;
        }
      }
    }
  }
</script>

<style scoped>

</style>
