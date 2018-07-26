<template>
	<div class="daterange-picker bottom" @click.stop="">
		<div class="title">
			When do you want this task to be done?
		</div>
		<div class="planning-types">
			<div v-for="planning in planningList" :key="planning"
				class="planning-type" v-bind:class="{active: planningType === planning}">
				{{planning}}
			</div>
		</div>
		<div class="planning-controls">
			<div class="planning-dates">
				<div class="header">Dates:</div>
				<div>
					<form>
						<div class="form-item">
							<div class="form-element">
								<input type="text" v-model="form.startDate"></input>
								
							</div>
						</div>
						<div class="separator">-</div>
						<div class="form-item">
							<div class="form-element" @click.stop="focusInput('finishDate')">
								<input type="text" v-model="form.finishDate"
									ref="finishDate"></input>
								<div v-show="showEmptyField" class="empty-field"
									@mouseover="emptyField = today" @mouseleave="emptyField = defaultField">
									{{emptyField}}
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div class="planning-duration">
				<div class="header">Duration:</div>
				
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment'

export default {
	props: ['task'],
	data() {
		const today = moment().format('MM/DD/YYYY')
		return {
			planningType: 'backlogged',
			planningList: ['backlogged','today','tomorrow','next week','custom date'],
			today,
			defaultField: 'MM/DD/YYYY',
			emptyField: 'MM/DD/YYYY',
			showEmptyField: !this.task.startDate,
			form: {
				startDate: this.task.startDate,
				finishDate: this.task.finishDate
			}
		}
	},
	methods: {
		focusInput(formType) {
			this.showEmptyField = false
			if (!this.form.startDate) {
				this.form.startDate = this.today
				this.form.finishDate = this.today
				this.planningType = 'today'
			}
			this.$refs[formType].focus()
		}
	}
}
</script>

<style>
.daterange-picker {
  box-sizing: border-box;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16), 0 0 1px 0 rgba(0, 0, 0, 0.16);

  /* Position the tooltip */
  position: absolute;
  z-index: 10000;

	text-align: left;
  width: 550px;
}

.daterange-picker.bottom {
  top: 30px;
  left: -152px;  
}

.title {
	font-size: 17px;
	color: #111;
	line-height: 27px;
	padding: 18px;
}

.planning-type {
	display: inline-block;
	font-weight: 700;
	font-size: 11px;
	color: #504f4f;
	line-height: 18px;
	margin-left: 18px;
	cursor: pointer;
  border-bottom: 2px solid transparent;
	text-transform: uppercase;
}

.planning-type.active {
  border-bottom-color: #5285b8;
}

.planning-controls {
	padding: 18px;
}

.planning-dates {
	width: 236px;
	display: inline-block;
	vertical-align: top;
}

.planning-duration {
	width: 236px;
	display: inline-block;
	vertical-align: top;
}

.header {
	font-size: 17px;
	color: #111;
	line-height: 27px;
	margin-bottom: 9px; 
}

.separator {
	display: inline-block;
	padding: 0 6px;
	vertical-align: top;
	font-weight: 700;
	font-size: 15px;
}

form {
/*	display: flex;
	flex-direction: row;
*/}

.form-item {
	height: 27px;
	display: inline-block;
	line-height: 18px;
}

.form-element {
	position: relative;
  border: 1px solid;
	border-color: #d1d1d3;
	border-radius: 2px;
}

.form-element > input {
	height: 25px;
	vertical-align: middle;
	box-sizing: border-box;
	width: 105px;
	background-color: #fff;
	padding: 0 8px;
}

.empty-field {
	font-size: 13px;
  line-height: 18px;
  font-weight: 400;
  color: gray;
  padding: 4px 8px 0;
  position: absolute;
  overflow: hidden;
  width: 89px;
  height: 23px;
  left: 0px;
  top: 0px;
}

</style>