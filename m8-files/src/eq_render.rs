use std::f64::consts::PI;

use crate::eq::{EqBand, EqMode, EqType, Equ};

/// See https://www.w3.org/TR/audio-eq-cookbook/
#[derive(Debug)]
pub struct BiQuadCoeffs {
    pub a0: f64,
    pub a1: f64,
    pub a2: f64,

    pub b0: f64,
    pub b1: f64,
    pub b2: f64
}

pub struct BiQuadFreqResponseCoeff {
    pub cst_num: f64,
    pub cstp_num : f64,
    pub coeff_num: f64,

    pub cst_denom: f64,
    pub cstp_denom : f64,
    pub coeff_denom: f64
}

impl BiQuadFreqResponseCoeff {
    pub fn response(&self, p : f64) -> f64 {
        let num = self.cst_num - p * (self.coeff_num * (1.0 - p) + self.cstp_num);
        let denom = self.cst_denom - p * (self.coeff_denom * (1.0 - p) + self.cstp_denom);
        (num / denom).sqrt()
    }
}

impl BiQuadCoeffs {
    pub fn freq_response_coeff(&self) -> BiQuadFreqResponseCoeff {
        BiQuadFreqResponseCoeff {
            cst_num: ((self.b0 + self.b1 + self.b2) / 2.0).powi(2),
            cstp_num : (self.b1 * (self.b0 + self.b2)),
            coeff_num: 4.0 * self.b0 * self.b2,

            cst_denom: ((self.a0 + self.a1 + self.a2) / 2.0).powi(2),
            cstp_denom : (self.a1 * (self.a0 + self.a2)),
            coeff_denom: 4.0 * self.a0 * self.a2
        }
    }

    pub fn normalized(&self) -> Self {
        let a0 = self.a0;
        Self {
            a0: 1.0,
            a1: self.a1 / a0,
            a2: self.a2 / a0,
            b0: self.b0 / a0,
            b1: self.b1 / a0,
            b2: self.b2 / a0
        }
    }
}


impl EqBand {

    /// See https://www.w3.org/TR/audio-eq-cookbook/
    pub fn coeffs(&self, sample_rate: usize) -> BiQuadCoeffs {
        let sample_rate = sample_rate as f64;
        let a = (10.0 as f64).powf(self.gain()/40.0);
        let q = 
            if self.mode.eq_type() == EqType::Bell {
                (self.q as f64) * a
            } else {
                (self.q as f64) / 100.0
            };

        let w0 = 2.0 * PI * (self.frequency() as f64) / sample_rate;
        let alpha = w0.sin() / (2.0 * q);

/*

notch:      H(s) = (s^2 + 1) / (s^2 + s/Q + 1)

            b0 =   1
            b1 =  -2*cos(w0)
            b2 =   1
            a0 =   1 + alpha
            a1 =  -2*cos(w0)
            a2 =   1 - alpha



APF:        H(s) = (s^2 - s/Q + 1) / (s^2 + s/Q + 1)

            b0 =   1 - alpha
            b1 =  -2*cos(w0)
            b2 =   1 + alpha
            a0 =   1 + alpha
            a1 =  -2*cos(w0)
            a2 =   1 - alpha



 */
        let cw0 = w0.cos();
        match self.mode.eq_type() {
            EqType::LowCut => {
                // HPF:        H(s) = s^2 / (s^2 + s/Q + 1)
                BiQuadCoeffs {
                    b0:  (1.0 + cw0)/2.0,
                    b1: -(1.0 + cw0),
                    b2:  (1.0 + cw0)/2.0,
                    a0:   1.0 + alpha,
                    a1:  -2.0*cw0,
                    a2:   1.0 - alpha
                }
            }
            EqType::LowShelf => {
                // lowShelf: H(s) = A * (s^2 + (sqrt(A)/Q)*s + A)/(A*s^2 + (sqrt(A)/Q)*s + 1)

                let sqra = a.sqrt();
                BiQuadCoeffs {
                    b0:      a*( (a+1.0) - (a-1.0)*cw0 + 2.0 * sqra * alpha ),
                    b1:  2.0*a*( (a-1.0) - (a+1.0)*cw0                   ),
                    b2:      a*( (a+1.0) - (a-1.0)*cw0 - 2.0 * sqra*alpha ),
                    a0:        (a+1.0) + (a-1.0)*cw0 + 2.0 * sqra*alpha,
                    a1:   -2.0*( (a-1.0) + (a+1.0)*cw0                   ),
                    a2:        (a+1.0) + (a-1.0)*cw0 - 2.0 *sqra*alpha
                }
            },
            EqType::Bell => {
                // peakingEQ:  H(s) = (s^2 + s*(A/Q) + 1) / (s^2 + s/(A*Q) + 1)
                BiQuadCoeffs {
                    b0: 1.0 + alpha * a,
                    b1: -2.0 * cw0,
                    b2: 1.0 - alpha * a,
                    a0: 1.0 + alpha / a,
                    a1: -2.0 * cw0,
                    a2: 1.0 - alpha / a
                }
            },
            EqType::BandPass => {
                // BPF:        H(s) = (s/Q) / (s^2 + s/Q + 1)      (constant 0 dB peak gain)
                BiQuadCoeffs {
                    b0:   alpha,
                    b1:   0.0,
                    b2:  -alpha,
                    a0:   1.0 + alpha,
                    a1:  -2.0*cw0,
                    a2:   1.0 - alpha,
                }
            },
            EqType::HiShelf => {
                // highShelf: H(s) = A * (A*s^2 + (sqrt(A)/Q)*s + 1)/(s^2 + (sqrt(A)/Q)*s + A)
                let sqrta = a.sqrt();
                BiQuadCoeffs {
                    b0:      a*( (a+1.0) + (a-1.0)*cw0 + 2.0*sqrta*alpha ),
                    b1: -2.0*a*( (a-1.0) + (a+1.0)*cw0                   ),
                    b2:      a*( (a+1.0) + (a-1.0)*cw0 - 2.0*sqrta*alpha ),
                    a0:        (a+1.0) - (a-1.0)*cw0 + 2.0*sqrta*alpha,
                    a1:    2.0*( (a-1.0) - (a+1.0)*cw0                   ),
                    a2:        (a+1.0) - (a-1.0)*cw0 - 2.0*sqrta*alpha
                }
            },
            EqType::HiCut => {
                // LPF:        H(s) = 1 / (s^2 + s/Q + 1)
                BiQuadCoeffs {
                    b0:  (1.0 - cw0)/2.0,
                    b1:   1.0 - cw0,
                    b2:  (1.0 - cw0)/2.0,
                    a0:   1.0 + alpha,
                    a1:  -2.0*cw0,
                    a2:   1.0 - alpha
                }
            }
        }
    }
}

impl Equ {
    pub fn accumulate(&self, freqs: &[f64], mode: EqMode) -> Vec<f64> {
        let sample_rate = 44100;
        let mut coeffs = vec![];

        if self.low.mode.eq_mode() == mode {
            let c0 = self.low.coeffs(sample_rate).normalized().freq_response_coeff();
            coeffs.push(c0);
        }

        if self.mid.mode.eq_mode() == mode {
            let c1 = self.mid.coeffs(sample_rate).normalized().freq_response_coeff();
            coeffs.push(c1);
        }

        if self.high.mode.eq_mode() == mode {
            let c2 = self.high.coeffs(sample_rate).normalized().freq_response_coeff();
            coeffs.push(c2);
        }

        freqs
          .iter()
          .map(|freq| {
              let mut p = ((PI * freq) / (sample_rate as f64)).sin();
              p = p * p;
         
              let mut v = 1.0;

              for c in &coeffs {
                v *= c.response(p)
              }

              v.log10()
          }).collect()
    }
}

