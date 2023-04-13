<template>
  <body>
    <div id="main-content">
      <div id="calculator"
        :class="{ calcuatorDesignBStart: this.isInExperiment && this.resultsHiden && !this.slideAnimation, calcuatorDesignBEnd: this.isInExperiment && !this.resultsHiden, calcuatorDesignA: !this.isInExperiment, divSlide: this.slideAnimation }">

        <div class="table-row">
          <div class="table-cell">
            <label for="initialCapital"> Starting Capital: </label>
          </div>
          <div class="table-cell">
            <span class="input-euro left">
              <input v-model="initialCapital" type="number" id="initialCapital" name="initialCapital"> <br>
            </span>
          </div>
          <div class="table-cell" v-if="this.resultsHiden && !this.slideAnimation">
            <p>
              &lt;- How much money are you starting with?
            </p>
          </div>
        </div>

        <div class="table-row">
          <div class="table-cell">
            <label for="optionalContributionValue"> Additional Contribution:</label>
          </div>
          <div class="table-cell">
            <span class="input-euro left">
              <input v-model="optionalContributionValue" type="number" id="optionalContributionValue"
                name="optionalContributionValue"> <br>
            </span>
          </div>
          <div class="table-cell" v-if="this.resultsHiden && !this.slideAnimation">
            <p>
              &lt;- How much money, if any, are you adding periodically?
            </p>
          </div>
        </div>

        <div class="table-row">
          <div class="table-cell">
            <label for="optionalContributionFequency"> Additional contribution every </label>
          </div>
          <div class="table-cell">
            <input v-model="optionalContributionFequency" type="number" id="optionalContributionFequency"
              name="optionalContributionFequency">
            <select v-model="optionalContributionPeriod" id="optionalContributionPeriod"
              name="optionalContributionPeriod">
              <option value="month">Months</option>
              <option value="year">Years</option>
            </select> <br>
          </div>
          <div class="table-cell" v-if="this.resultsHiden && !this.slideAnimation">
            <p>
              &lt;- How often are you adding money?
            </p>
          </div>
        </div>

        <div class="table-row">
          <div class="table-cell">
            <label for="compoundFrequency"> Expected intrest rate: </label>
          </div>
          <div class="table-cell">
            <span class="input-percent right">
              <input v-model="compoundFrequency" type="number" id="compoundFrequency" name="compoundFrequency">
            </span>
            <select v-model="compoundFrequencyPeriod" id="compoundFrequencyPeriod" name="compoundFrequencyPeriod">
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select> <br>
          </div>
          <div class="table-cell" v-if="this.resultsHiden && !this.slideAnimation">
            <p>
              &lt;- what percent gains do you expect and how often?
            </p>
          </div>
        </div>

        <div class="table-row">
          <div class="table-cell">
            <label for="optinalFeesValue"> Optional tax / fees : </label>
          </div>
          <div class="table-cell">
            <span class="input-euro left">
              <input v-model="optinalFeesValue" type="number" id="optinalFeesValue" name="optinalFeesValue">
            </span>
            <select v-model="optinalFeesPeriod" id="optinalFeesPeriod" name="optinalFeesPeriod">
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select> <br>
          </div>
          <div class="table-cell" v-if="this.resultsHiden && !this.slideAnimation">
            <p>
              &lt;- How much are you being charged per month / year ?
            </p>
          </div>
        </div>

        <div class="table-row">
          <div class="table-cell">
            <label for="investmentPeriodValue"> Invested for: </label>
          </div>
          <div class="table-cell">
            <input v-model="investmentPeriodValue" type="number" id="investmentPeriodValue" name="investmentPeriodValue">
            <select v-model="investmentPeriod" id="investmentPeriod" name="investmentPeriod">
              <option value="month">Months</option>
              <option value="year">Years</option>
            </select> <br>
          </div>
          <div class="table-cell" v-if="this.resultsHiden && !this.slideAnimation">
            <p>
              &lt;- How long are you investing for?
            </p>
          </div>
        </div>
        <button @click="caluclate"> Submit</button>

      </div>
      <div v-if="!this.resultsHiden" id="results-body" :class="{ fadeIn: this.divFade }">
        <div id="app">
          <Chart v-bind:savings="savings" />
        </div>
        <div id="text-results">
          <p> Total after investment €{{ calculatorResult }} </p>
          <p> Total gained €{{ compoundGains }} </p>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import Chart from './components/Compound-Chart.vue'
// import { logEvent } from "firebase/analytics";
// import { analytics } from "/public/index.html"

export default {
  name: 'App',
  components: {
    Chart
  },
  data() {
    return {
      divFade: false,
      isInExperiment: true,
      resultsHiden: true,
      slideAnimation: false,
      initialCapital: '',
      optionalContributionValue: '',
      optionalContributionFequency: '',
      optionalContributionPeriod: "year",
      compoundFrequency: '',
      compoundFrequencyPeriod: "year",
      optinalFeesValue: '',
      optinalFeesPeriod: "year",
      investmentPeriodValue: '',
      investmentPeriod: "year",
      compoundJourney: [],
      calculatorResult: 0,
      compoundGains: 0,
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
        return 12
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
  methods: {
    caluclate() {
      if (this.isInExperiment && this.resultsHiden) {
        this.animateDiv()
      }
      // logEvent(analytics, 'notification_received');
      this.compoundJourney = []
      let currentMoney = this.initialCapital
      let moneyInvested = [this.initialCapital]
      let chartLabels = []
      if (currentMoney != 0 || currentMoney != "") {
        // eslint-disable-next-line
        this.compoundJourney.push(Math.round((currentMoney + Number.EPSILON) * 100) / 100)
      }
      if (this.investmentPeriod == "year") {
        chartLabels.push("Year 0")
      } else {
        chartLabels.push("Month 0")
      }
      for (let i = 1; i <= this.investedTimeMonths; i++) {
        currentMoney = currentMoney * (1 + (this.monthlyIntrestRate / 100))

        if (this.investmentPeriod == "year" && i % 12 == 0) {
          chartLabels.push("Year " + i / 12)
        } else if (this.investmentPeriod == "month") {
          chartLabels.push("Month " + i)
        }
        if (i % this.contributeEveryXMonths == 0) {
          currentMoney = currentMoney + this.optionalContributionValue
          moneyInvested.push(moneyInvested[moneyInvested.length - 1] + this.optionalContributionValue)
        } else {
          moneyInvested.push(moneyInvested[moneyInvested.length - 1])
        }
        if (i % this.feesEveryXMonths == 0) {
          currentMoney = currentMoney - this.optinalFeesValue
        }
        this.compoundJourney.push(Math.round((currentMoney + Number.EPSILON) * 100) / 100)
      }
      this.calculatorResult = Math.round((currentMoney + Number.EPSILON) * 100) / 100
      let gains = this.calculatorResult - this.initialCapital
      this.compoundGains = Math.round((gains + Number.EPSILON) * 100) / 100

      if (this.investmentPeriod == "month") {
        this.savings.compound = this.compoundJourney
        this.savings.contributions = moneyInvested
      } else if (this.investmentPeriod == "year") {
        let compoundGrowth = []
        let contributionGrowth = []
        for (let i = 0; i < this.compoundJourney.length; i = i + 12) {
          compoundGrowth.push(this.compoundJourney[i]);
          contributionGrowth.push(moneyInvested[i])
        }
        this.savings.compound = compoundGrowth
        this.savings.contributions = contributionGrowth
      }

      this.savings.labels = chartLabels
    },
    animateDiv() {
      this.slideAnimation = true;
      setTimeout(() => {
        this.slideAnimation = false
        this.resultsHiden = false
        this.divFade = true
      }, 1500)
    }
  }
}

</script>