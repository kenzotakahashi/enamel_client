<template>
	<div class="record-form bottom" @click.stop="">
		<div class="time-logger">
			<form>
				<div class="form-item">
					<div class="form-element">
						<input type="number" class="hours" min="0"
							v-model="hours"></input>
					</div>					
				</div>
				<div class="colon">:</div>
				<div class="form-item">
					<div class="form-element">
						<input type="number" class="minutes" min="0" max="50" step="10"
							v-model="minutes"></input>
					</div>					
				</div>
			</form>	
			<div class="date-label">
				<span>for</span>
				<span class="date">{{ formattedDate }}</span>
			</div>				
		</div>
		<div class="comment">
			<textarea placeholder="Comment"></textarea>
		</div>

		<div class="controls">
		  <el-button type="primary" size="small" :disabled="hours === 0 && minutes === 0"
		  	@click="create">Add entry</el-button>
		  <el-button type="text" size="small" @click="deleteRecord">Reset timer</el-button>
		</div>
	</div>
</template>

<script>
import moment from 'moment'
import { CreateRecord, UpdateRecord, DeleteRecord } from '@/constants/query.gql'

export default {
	props: ['task', 'record'],
	data() {
		const { timeSpent, comment } = this.record || {}
		const [ hours, minutes ] = timeSpent
			? timeSpent.split(':').map(o => parseInt(o))
			: [0,0]
		// console.log(hours)
		return {
			hours,
			minutes,
			comment,
			date: moment()
		}
	},
	computed: {
		formattedDate() {
			return this.date.format('MMM DD')
		}
	},
	methods: {
		create() {
			const input = {
				task: this.task.id,
				date: this.date.format('YYYY-MM-DD'),
				timeSpent: `${this.hours}:${this.minutes}`,
				comment: this.comment
			}
			if (this.record) {
				this.createRecord({
					mutation: UpdateRecord,
					variables: {
						id: this.record.id,
						input
					}
				})
			} else {
				this.createRecord({
					mutation: CreateRecord,
					variables: {input}
				})
			}
		},
		createRecord(arg) {
		  this.$apollo.mutate(arg).then(() => {
				this.changeActiveWidget(null)    
		  }).catch((error) => {
		    console.log(error)
		  })
		},
		deleteRecord() {
			if (!this.record) {
				this.changeActiveWidget(null)    
				return
			}
			this.$apollo.mutate({
				mutation: DeleteRecord,
				variables: { id: this.record.id }
			}).then(() => {
				this.changeActiveWidget(null)
			}).catch((error) => {
				console.log(error)
			})
		},
		changeActiveWidget(key) {
		  this.$store.dispatch('changeActiveWidget', key)
		},
	}
}
</script>

<style scoped>
.record-form {
  box-sizing: border-box;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16), 0 0 1px 0 rgba(0, 0, 0, 0.16);

  /* Position the tooltip */
  position: absolute;
  z-index: 10000;

	text-align: left;
  width: 290px;
}

.record-form.bottom {
  top: 30px;
  left: -62px;  
}

.time-logger {
	display: flex;
	align-items: center;
	padding: 17px 17px 0;
}

form {
	display: flex;
	font-size: 24px;
	font-family: 'Tahoma',sans-serif;
}

.form-item {
}

.form-element {
	/*height: 34px;	*/
	display: inline-block;
	position: relative;
  border: 1px solid;
	border-color: #d1d1d3;
	border-radius: 2px;
}

.hours {
	width: 45px;
}

.minutes {
	width: 45px;
}

.form-element > input {
	vertical-align: unset;
	padding: 0 7px;
	/*height: 100%;*/
}

.colon {
	padding: 0 7px;
}

.date-label {
	padding: 0 10px;
}

.date {
	padding-left: 7px;
}

.comment {
	box-sizing: border-box;
	height: 86px;
	overflow: auto;
	padding: 5px 10px;
	margin: 8px 17px 0;
	background: 0 0;
	-webkit-user-select: text;
	-moz-user-select: text;
	-ms-user-select: text;
	user-select: text;
	word-wrap: break-word;
}

.comment > textarea {
	width: 100%;
	height: 100%;
}

.controls {
	padding: 10px 17px;
	overflow: hidden;
}

</style>