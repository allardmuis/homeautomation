#include <esp_adc_cal.h>
#define REF_VOLTAGE 1080

struct GroupMeasurement {
    float group1;
    float group2;
    float group3;
    float group4;
    float group5;
    float incoming;
};

const uint8_t TMP_PIN1 = 32;
const uint8_t TMP_PIN2 = 33;
const uint8_t TMP_PIN3 = 34;
const uint8_t TMP_PIN4 = 35;
const uint8_t TMP_PIN5 = 36;
const uint8_t TMP_PIN6 = 39;

esp_adc_cal_characteristics_t *adc_chars;
uint16_t avgAnalogRead(uint8_t pin, uint16_t samples = 8) {
  adc1_channel_t chan;
  switch (pin) {
    case 32:
      chan = ADC1_CHANNEL_4;
      break;
    case 33:
      chan = ADC1_CHANNEL_5;
      break;
    case 34:
      chan = ADC1_CHANNEL_6;
      break;
    case 35:
      chan = ADC1_CHANNEL_7;
      break;
    case 36:
      chan = ADC1_CHANNEL_3;
      break;
    case 39:
      chan = ADC1_CHANNEL_0;
      break;
  }
  uint32_t sum = 0;
  for (int x=0; x<samples; x++) {
    sum += adc1_get_raw(chan);
  }
  sum /= samples;

  return esp_adc_cal_raw_to_voltage(sum, adc_chars);
}

void setupTMP36() {
    adc2_vref_to_gpio(GPIO_NUM_25);
    adc_chars = new esp_adc_cal_characteristics_t;
    adc1_config_width(ADC_WIDTH_BIT_11);
    adc1_config_channel_atten(ADC1_CHANNEL_5,ADC_ATTEN_DB_11);
    esp_adc_cal_value_t val_type = esp_adc_cal_characterize(ADC_UNIT_1, ADC_ATTEN_DB_11, ADC_WIDTH_BIT_11, REF_VOLTAGE, adc_chars);
}

float readTMP36(uint8_t PIN) {
    int voltage = avgAnalogRead(PIN, 16);
    float temp = (voltage - 500.0) /10;

    return temp;
}

GroupMeasurement readAllTMP36() {
    float group1 = readTMP36(TMP_PIN1);
    float group2 = readTMP36(TMP_PIN2);
    float group3 = readTMP36(TMP_PIN3);
    float group4 = readTMP36(TMP_PIN4);
    float group5 = readTMP36(TMP_PIN5);
    float incoming = readTMP36(TMP_PIN6);

    return {
      group1, group2, group3, group4, group5, incoming
    };
}
