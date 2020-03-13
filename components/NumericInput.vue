<template>
    <div class="vue-numeric-input">
        <input
                :name="name"
                ref="input"
                type="number"
                :class="['numeric-input', this.controls ? '':'no-control']"
                :value="numericValue"
                :placeholder="placeholder"
                :max="max"
                :min="min"
                :style="{'textAlign': this.align}"
                @input="inputHandler($event.target.value)"
                @change="onChange"
                @blur="onBlur"
                @focus="onFocus"
                :autofocus="autofocus"
                :disabled="disabled"
                :readonly="readonly"
        >
        <button
                type="button"
                v-if="controls"
                class="btn btn-decrement"
                @mousedown="start(decrement)"
                @touchstart.prevent="start(decrement)"
                @touchend.prevent="stop"
                :disabled="disabled || numericValue <= min"
        >
            <i class="btn-icon"></i>
        </button>
        <button
                type="button"
                v-if="controls"
                class="btn btn-increment"
                @mousedown="start(increment)"
                @touchstart.prevent="start(increment)"
                @touchend.prevent="stop"
                :disabled="disabled || numericValue >= max"
        >
            <i class="btn-icon"></i>
        </button>
    </div>
</template>
<script>
    const timeInterval = 100;

    export default {
        name: 'numeric-input',
        props: {
            name: String,
            value: Number,
            placeholder: String,
            min: {
                type: Number,
                default: -Infinity
            },
            max: {
                type: Number,
                default: Infinity
            },
            step: {
                type: Number,
                default: 1
            },
            align: {
                type: String,
                default: 'left'
            },
            precision: {
                type: Number,
                validator (val) {
                    return val >= 0 && Number.isInteger(val)
                }
            },
            autofocus: {
                type: Boolean,
                default: false
            },
            readonly: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            controls: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                numericValue: null,
                interval: null,
                startTime: null,
                handler: Function
            }
        },
        watch: {
            // Watch for value change
            value: {
                immediate: true,
                // handle the changed value
                handler (val) {
                    let newValue = val;
                    if (newValue) {
                        newValue = this.toPrecision(newValue, this.precision)
                        if (newValue >= this.max) {
                            newValue = this.max
                        }
                        if (newValue <= this.min) {
                            newValue = this.min
                        }
                        if (newValue !== val) {
                            this.$emit('input', newValue)
                        }
                    }
                    this.numericValue = newValue
                }
            }
        },
        methods: {
            /**
             * Function convert value to number
             * @param val
             * @returns {number | Number}
             */
            toNumber (val) {
                let num = parseFloat(val)
                if (isNaN(val) || !isFinite(val)) {
                    num = 0
                }
                return num
            },
            /**
             * Function to return fixed decimal precision of input val
             * @param val
             * @param precision
             * @returns {number | Number}
             */
            toPrecision (val, precision) {
                return precision !== undefined ? parseFloat(val.toFixed(precision)) : val
            },
            /**
             * Increment the current numeric value
             */
            increment () {
                if (!this.readonly) this.updateValue(this.toNumber(this.numericValue) + this.step)
            },
            /**
             * Decrement the current numeric value
             */
            decrement () {
                if (!this.readonly) this.updateValue(this.toNumber(this.numericValue) - this.step)
            },
            /**
             * Handle value on Input
             */
            inputHandler (val) {
                this.updateValue(this.toNumber(val), val)
            },
            /**
             * Update value on operation performed
             * @param val
             */
            updateValue: function (val, strVal = null) {
                const oldVal = this.numericValue
                val = this.toPrecision(val, this.precision)
                if (val >= this.max) {
                    val = this.max
                }
                if (val <= this.min) {
                    val = this.min
                }
                if (val === oldVal) {
                    this.$refs.input.value = strVal && val === this.toNumber(strVal) ? strVal : val
                    return
                }
                this.numericValue = val
                this.$emit('input', val)
            },
            /**
             *  Start a repetitive call to increment and decrement method after a timeInterval on mousedown event and will stop on mouseup event on controls
             * @param handler - increment or decrement method
             */
            start (handler) {
                document.addEventListener('mouseup', this.stop)
                this.startTime = new Date()
                this.handler = handler
                clearInterval(this.interval)
                this.interval = setInterval(handler, timeInterval)
            },
            /**
             * clear interval on mouseup event and remove the listener
             * @param evt - event to be removed
             */
            stop (evt) {
                document.removeEventListener(evt.type, this.stop)
                if (new Date() - this.startTime < timeInterval) {
                    this.handler()
                }
                clearInterval(this.interval)
                this.interval = null
                this.handler = null
                this.startTime = null
                if (this.value !== this.numericValue) this.$emit('change', this.numericValue)
            },
            /**
             * On blur event trigger
             * @param event - blur event on input
             */
            onBlur (event) {
                this.$emit('blur', event)
            },
            /**
             * On focus event trigger on input
             * @param event
             */
            onFocus (event) {
                this.$emit('focus', event)
            },
            /**
             * On change event trigger on input
             * @param event
             */
            onChange (event) {
                this.$emit('change', this.numericValue)
            },
            /**
             * focus method to set the focus on input
             */
            focus () {
                if (!this.disabled) {
                    this.$refs.input.focus()
                }
            },
            /**
             * blur to be trigger on input
             */
            blur () {
                this.$refs.input.blur()
            }
        },
        beforeDestroy () {
            clearInterval(this.interval)
            this.interval = null
            this.handler = null
            this.startTime = null
        }
    }
</script>
<style scoped>
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] {-moz-appearance: textfield;}
    button:focus {
        outline: none;
    }
</style>
<style>
    .vue-numeric-input input {
      margin: 0 !important;
      border-bottom: none !important;
      box-shadow: none !important;
    }

    .vue-numeric-input {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        max-width: 100%;
        width: 100%;
        margin-bottom: 0.5rem;
    }
    .vue-numeric-input .numeric-input {
        padding-right: 1.8rem;
        padding-left: 1.8rem;
        box-sizing: border-box;
        font-size: inherit;
        border: 1px solid #cccccc;
        border-radius: 2px;
        display: block;
        line-height: 1.5rem;
        transition: all 0.1s ease 0s;
        width: 100%;
    }
    .vue-numeric-input .btn {
        position: absolute;
        width: 1.5rem;
        margin: 0;
        text-align: center;
        transition: all 0.1s ease 0s;
        cursor: pointer;
        background-color: #cccccc !important;
    }
    .vue-numeric-input .btn:hover {
        background: rgba(0, 0, 0, 0.1);
    }
    .vue-numeric-input .btn:active {
        box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px inset, rgba(255, 255, 255, 0.5) -1px -1px 4px inset;
    }
    .vue-numeric-input .btn:disabled {
        opacity: 0.5;
        box-shadow: none;
        cursor: not-allowed;
    }
    .vue-numeric-input .numeric-input.no-control {
        padding: 2px 5px;
    }
    .vue-numeric-input .btn-increment {
        right: 2px;
        top: 2px;
        bottom: 2px;
        border-radius: 2px;
        border-width: 1px;
    }
    .vue-numeric-input .btn-increment .btn-icon {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    .vue-numeric-input .btn-increment .btn-icon:before {
        position: absolute;
        visibility: visible;
        height: 0.0625rem;
        width: 50%;
        background-color: #111;
        content: "";
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .vue-numeric-input .btn-increment .btn-icon:after {
        position: absolute;
        visibility: visible;
        height: 50%;
        width: 0.0625rem;
        background-color: #111;
        content: "";
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .vue-numeric-input .btn-decrement {
        left: 2px;
        top: 2px;
        bottom: 2px;
        border-radius: 2px;
        border-width: 1px;
    }
    .vue-numeric-input .btn-decrement .btn-icon {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    .vue-numeric-input .btn-decrement .btn-icon:before {
        position:absolute;
        visibility: visible;
        height: 0.0625rem;
        width: 50%;
        background-color: #111;
        content: "";
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .vue-numeric-input .btn-decrement .btn-icon:after {
        visibility: hidden;
        content: "";
        clear: both;
        height: 0;
    }
</style>
