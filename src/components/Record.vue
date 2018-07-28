<template>
	<div class="daterange-picker bottom" @click.stop="">
		<div class="title">
			When do you want this task to be done?
		</div>
		<div class="planning-types">
			<div v-for="planning in planningList" :key="planning"
				@click="changePlanningType(planning)"
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
							<div class="form-element" @click.stop="focusInput('startDate')">
								<input type="text" v-model="startDate"
									ref="startDate" @input="">	
								</input>
								<div v-show="showEmptyField" class="empty-field"
									@mouseover="emptyField = today" @mouseleave="emptyField = defaultField">
									{{emptyField}}
								</div>
							</div>
						</div>

						<div class="separator">-</div>

						<div class="form-item">
							<div class="form-element" @click.stop="focusInput('finishDate')">
								<input type="text" v-model="finishDate"
									ref="finishDate" @input="">
								</input>
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
					<form>
						<div class="form-item">
<!-- 							<div class="form-element">
								<input type="number" class="duration" min="0"
									v-model="duration"></input>
							</div> -->
							<span>{{duration}}</span>
							<span class="duration-label">{{durationLabel}}</span>
						</div>
					</form>				
			</div>
		</div>

		<section>
		  <el-button type="primary" @click="updateTask">OK</el-button>
		  <el-button type="text" @click="changeActiveWidget(null)">
		  	Cancel
		  </el-button>          
		</section>
	</div>
</template>

<script>
import moment from 'moment'
import { CreateRecord, UpdateRecord, DeleteRecord } from '@/constants/query.gql'

export default {
	props: ['task'],
	data() {
		return {
		}
	},
	methods: {
		updateRecord() {
		  this.$apollo.mutate({
		    mutation: UpdateRecord,
		    variables: {
		    	id: this.task.id,
		    	input: {
		    	}
		    },
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
  top: 0px;
  left: -162px;  
}


</style>