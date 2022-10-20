; ModuleID = 'probe7.565f817f-cgu.0'
source_filename = "probe7.565f817f-cgu.0"
target datalayout = "e-m:e-p:32:32-p10:8:8-p20:8:8-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

; probe7::probe
; Function Attrs: nounwind
define hidden void @_ZN6probe75probe17h5bd7cc1497e0d865E() unnamed_addr #0 {
start:
; call std::f64::<impl f64>::copysign
  %_1 = call double @"_ZN3std3f6421_$LT$impl$u20$f64$GT$8copysign17h018332979159051cE"(double 1.000000e+00, double -1.000000e+00) #2
  br label %bb1

bb1:                                              ; preds = %start
  ret void
}

; std::f64::<impl f64>::copysign
; Function Attrs: inlinehint nounwind
declare hidden double @"_ZN3std3f6421_$LT$impl$u20$f64$GT$8copysign17h018332979159051cE"(double, double) unnamed_addr #1

attributes #0 = { nounwind "target-cpu"="generic" }
attributes #1 = { inlinehint nounwind "target-cpu"="generic" }
attributes #2 = { nounwind }
