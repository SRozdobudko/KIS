<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md10>
        <v-card class="elevation-12">
          <v-toolbar color="gray">
            <v-toolbar-title color>Добавление нового пользователя</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-layout row wrap>
                <v-flex xs12 sm4 pa-1>
                  <v-text-field
                    name="sname"
                    label="Фамилия *"
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
                    label="Имя *"
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
                    label="Oтчество *"
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
                  ></v-select>
                </v-flex>
                <template v-if="documentSelectedType === 'rus'">
                  <v-flex xs12 sm4 pa-1 d-flex>
                    <v-text-field
                      name="serieRus"
                      label="Серия паспорта *"
                      type="text"
                      :mask="'####'"
                      :rules="[v => !!v || 'Серия паспорта обязательное поле !']"
                      v-model="serie">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 pa-1 d-flex>
                    <v-text-field
                      name="docNumberRus"
                      label="Номер паспорта *"
                      type="text"
                      :rules="[v => !!v || 'Номер паспорта обязательное поле !']"
                      :mask="'######'"
                      v-model="docNumber">
                    </v-text-field>
                  </v-flex>
                </template>
                <template v-else-if="documentSelectedType === 'foreigner'">
                  <v-flex xs12 sm4 pa-1 d-flex>
                    <v-text-field
                      name="serie"
                      label="Серия паспорта *"
                      type="text"
                      :rules="[v => !!v || 'Серия паспорта обязательное поле !']"
                      v-model="serie">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 pa-1 d-flex>
                    <v-text-field
                      name="docNumber"
                      label="Номер паспорта"
                      type="text"
                      :rules="[v => !!v || 'Номер паспорта обязательное поле !']"
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
                    :rules="emailRules"
                    v-model="email">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm4 pa-1 d-flex>
                  <v-text-field
                    name="phone"
                    label="Телефон *"
                    type="tel"
                    v-mask="'+# (###) ###-####'"
                    :rules="[v => !!v || 'Телефон обязательное поле !']"
                    v-model="phone"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm4 pa-1>
                  <v-menu
                    ref="birthMenu"
                    :close-on-content-click="false"
                    v-model="birthMenu"
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
                      label="Дата рождения *"
                      prepend-icon="event"
                      :rules="[v => !!v || 'Дата рождения обязательное поле !']"
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      ref="picker"
                      v-model="birthDate"
                      :max="new Date().toISOString().substr(0, 10)"
                      :min="minDate"
                      @change="saveBirthDate"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm4 pa-1 d-flex>
                  <v-select
                    :items="groupType"
                    v-model="group"
                    :rules="[v => !!v || 'Группы обязательное поле !']"
                    label="Группы пользователя *"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm4 pa-1>
                  <v-menu
                    ref="workMenu"
                    :close-on-content-click="false"
                    v-model="workMenu"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px">

                    <v-text-field
                      slot="activator"
                      v-model="workDate"
                      label="Дата трудоустройства *"
                      prepend-icon="event"
                      readonly
                      :rules="[v => !!v || 'Дата трудоустройства обязательное поле !']"
                    ></v-text-field>
                    <v-date-picker
                      ref="picker"
                      v-model="workDate"
                      :max="new Date().toISOString().substr(0, 10)"
                      :min="minDate"
                      @change="saveWorkDate"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm4 pa-1 d-flex>
                  <v-select
                    :items="statusType"
                    v-model="status"
                    :rules="[v => !!v || 'Статус обязательное поле !']"
                    label="Статус *"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              @click="clear"
              small
            >Очистить
            </v-btn>
            <v-dialog v-model="dialog" :disabled="!valid" persistent max-width="290">
              <v-btn slot="activator" small :disabled="!valid" color="primary" @click.stop="submit">Продолжить</v-btn>
              <v-card>
                <v-card-title class="headline">Пользователь успешно создан!</v-card-title>
                <v-card-text>
                  {{ this.user ? this.user.name : ''}}, {{this.user ? this.user.sname: ''}}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" flat @click.native="dialog = false">Закрыть</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mask} from 'vue-the-mask'

  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() - 18).toString();
  export default {
    name: "NewUser",
    directives: {mask},
    data() {
      return {
        user: null,
        minDate: currentDate.toISOString().substr(0, 4),
        valid: false,
        name: null,
        sname: null,
        fname: null,
        documentSelectedType: null,
        serie: null,
        docNumber: null,
        currentDocType: null,
        phone: null,
        email: null,
        emailRules:  [
          (v) => { if(v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail должен быть валидным !'
          } else {
            return true;
          }
          }],
        birthMenu: false,
        birthDate: null,
        workMenu: false,
        workDate: null,
        group: null,
        status: null,
        dialog: false,
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
        dialog: false
      }
    },
    watch: {
      watch: {
        workMenu(val) {
          val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
        }
      },
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
      },
      saveWorkDate(date) {
        this.$refs.workMenu.save(date);
      },
      saveBirthDate(date) {
        this.$refs.birthMenu.save(date);
      },
      clear() {
        this.$refs.form.reset();
      },
      submit() {
        this.dialog = false;
        if (this.$refs.form.validate()) {
          this.dialog = true;
          const User = {
            name: this.name,
            sname: this.sname,
            fatherName: this.fname,
            documentType: {
              type: this.documentSelectedType,
              info: {
                serie: this.serie,
                documentNunmber: this.docNumber
              }
            },
            email: this.email ? this.email : `${this.phone.replace(/\D/g, '')}@mail.ru`,
            phone: this.phone,
            birthDate: this.birthDate,
            workDate: this.workDate,
            userGroup: this.group,
            status: this.status
          };
          this.user = User;
          console.log('User', User);
        }
      }
    }
  }
</script>

<style scoped>

</style>
