<template>
  <body>
    <div id="main-content">
        <div id = "calculator">
                <label for="initialCapital"> Starting Capital:</label>
                <input v-model="initialCapital" type="number" id="initialCapital" name="initialCapital"> <br>

                <label for="optionalContributionValue"> Additional Contribution:</label>
                <input v-model="optionalContributionValue" type="number" id="optionalContributionValue" name="optionalContributionValue"> <br>

                <label for="optionalContributionFequency"> Additional contribution every </label>
                <input v-model="optionalContributionFequency" type="number" id="optionalContributionFequency" name="optionalContributionFequency"> 
                <select v-model="optionalContributionPeriod" id="optionalContributionPeriod" name="optionalContributionPeriod">
                    <option value="month">Months</option>
                    <option value="year">Years</option>
                  </select> <br>
                
                <label for="compoundFrequency"> Intrest rate: </label>
                <input v-model="compoundFrequency" type="number" id="compoundFrequency" name="compoundFrequency"> 
                <select v-model="compoundFrequencyPeriod" id="compoundFrequencyPeriod" name="compoundFrequencyPeriod">
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                </select> <br>

                <label for="optinalFeesValue"> Optional tax / fees : </label>
                <input v-model="optinalFeesValue" type="number" id="optinalFeesValue" name="optinalFeesValue"> 
                <select v-model="optinalFeesPeriod" id="optinalFeesPeriod" name="optinalFeesPeriod">
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                </select> <br>

                <label for="investmentPeriodValue"> Invested for: </label>
                <input v-model="investmentPeriodValue" type="number" id="investmentPeriodValue" name="investmentPeriodValue"> 
                <select v-model="investmentPeriod" id="investmentPeriod" name="investmentPeriod">
                    <option value="month">Months</option>
                    <option value="year">Years</option>
                </select> <br>
                <button @click="caluclate"> Submit</button>

        </div>
        <div id ="results-body" >
          <div id="app">
            <Chart v-bind:savings="savings" />
          </div>
            <div id="text-results">
            <p> Total after investment €{{ compoundJourney }} </p>
            <p> Total gained €{{ compoundGains }} </p>
            </div>
        </div>
    </div>
</body>
</template>

<script>
import Chart from './components/Compound-Chart.vue'
import { getAnalytics, logEvent } from "firebase/analytics";

export default {
  name: 'App',
  components: {
    Chart
  },
  data() {
    return {
      analytics: getAnalytics(),
      initialCapital: 0,
      optionalContributionValue: 0,
      optionalContributionFequency: 1,
      optionalContributionPeriod: "year",
      compoundFrequency: 0,
      compoundFrequencyPeriod: "year",
      optinalFeesValue: 0,
      optinalFeesPeriod: "year",
      investmentPeriodValue: 0,
      investmentPeriod: "year",
      compoundJourney: [],
      calculatorResult:0,
      compoundGains:0,
      savings: {
        compound: [],
        contributions: [],
        labels: [],
    }
    }
  },
  computed: {
    contributeEveryXMonths: function () {
      if (this.optionalContributionPeriod == "year") {
        return this.optionalContributionFequency * 12
      }
      else {
        return this.optionalContributionFequency
      }
    },
    monthlyIntrestRate: function () {
      if (this.compoundFrequencyPeriod == "year") {
        return (this.compoundFrequency / 12)
      }
      else {
        return this.compoundFrequency
      }
    },
    feesEveryXMonths: function () {
      if (this.optinalFeesPeriod == "year") {
        return  12
      }
      else {
        return 1
      }
    },
    investedTimeMonths() {
      if (this.investmentPeriodValue != 0) {
        if (this.investmentPeriod == "year") {
          return 12 * this.investmentPeriodValue
        }
        else {
          return this.investmentPeriodValue
        }
      }
      else return 0
    },
  },
  methods:{
    caluclate(){
      logEvent(this.analytics, 'notification_received');
      this.compoundJourney = []
      let currentMoney = this.initialCapital
      let moneyInvested = [this.initialCapital]
      let chartLabels = []
      if(currentMoney != 0 || currentMoney !=""){
        // eslint-disable-next-line
        this.compoundJourney.push(Math.round((currentMoney + Number.EPSILON) * 100) / 100)
      }
      if(this.investmentPeriod =="year"){
        chartLabels.push("Year 0")
      }else{
        chartLabels.push("Month 0")
      }
      for (let i = 1; i <= this.investedTimeMonths; i++) {
        currentMoney = currentMoney  * (1 + (this.monthlyIntrestRate / 100))

        if(this.investmentPeriod=="year" && i%12 == 0){
          chartLabels.push("Year "+i/12)
        }else if(this.investmentPeriod =="month"){
          chartLabels.push("Month "+i)
        }
        if(i%this.contributeEveryXMonths ==0 ){
          currentMoney = currentMoney+ this.optionalContributionValue
          moneyInvested.push(moneyInvested[moneyInvested.length-1]+ this.optionalContributionValue)
        }else{
          moneyInvested.push(moneyInvested[moneyInvested.length-1])
        }
        if(i%this.feesEveryXMonths ==0 ){
          currentMoney = currentMoney- this.optinalFeesValue
        }
        this.compoundJourney.push(Math.round((currentMoney + Number.EPSILON) * 100) / 100)
      }
      this.calculatorResult = Math.round((currentMoney + Number.EPSILON) * 100) / 100
      let gains = this.calculatorResult - this.initialCapital
      this.compoundGains = Math.round((gains + Number.EPSILON) * 100) / 100

      if(this.investmentPeriod=="month"){
        this.savings.compound = this.compoundJourney
        this.savings.contributions= moneyInvested
      }else if(this.investmentPeriod == "year"){
        let compoundGrowth=[]
        let contributionGrowth=[]
        for (let i = 0; i < this.compoundJourney.length; i=i+12) {
          compoundGrowth.push(this.compoundJourney[i]);
          contributionGrowth.push(moneyInvested[i])
        }
        this.savings.compound = compoundGrowth
        this.savings.contributions= contributionGrowth
      }

      this.savings.labels = chartLabels
    }
  }
}

</script>