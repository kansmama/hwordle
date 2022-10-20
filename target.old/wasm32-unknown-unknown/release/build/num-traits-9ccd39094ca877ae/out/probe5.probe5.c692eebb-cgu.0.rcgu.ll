; ModuleID = 'probe5.c692eebb-cgu.0'
source_filename = "probe5.c692eebb-cgu.0"
target datalayout = "e-m:e-p:32:32-p10:8:8-p20:8:8-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

@alloc2 = private unnamed_addr constant <{ [4 x i8] }> <{ [4 x i8] c"\02\00\00\00" }>, align 4

; probe5::probe
; Function Attrs: nounwind
define hidden void @_ZN6probe55probe17h64a8a62705d259f4E() unnamed_addr #0 {
start:
  %x = alloca i32, align 4
  store i32 1, i32* %x, align 4
; call <i32 as core::ops::arith::AddAssign<&i32>>::add_assign
  call void @"_ZN66_$LT$i32$u20$as$u20$core..ops..arith..AddAssign$LT$$RF$i32$GT$$GT$10add_assign17hd0120abcd280c4e5E"(i32* noundef align 4 dereferenceable(4) %x, i32* noundef align 4 dereferenceable(4) bitcast (<{ [4 x i8] }>* @alloc2 to i32*)) #2
  br label %bb1

bb1:                                              ; preds = %start
  ret void
}

; <i32 as core::ops::arith::AddAssign<&i32>>::add_assign
; Function Attrs: inlinehint nounwind
declare hidden void @"_ZN66_$LT$i32$u20$as$u20$core..ops..arith..AddAssign$LT$$RF$i32$GT$$GT$10add_assign17hd0120abcd280c4e5E"(i32* noundef align 4 dereferenceable(4), i32* noundef align 4 dereferenceable(4)) unnamed_addr #1

attributes #0 = { nounwind "target-cpu"="generic" }
attributes #1 = { inlinehint nounwind "target-cpu"="generic" }
attributes #2 = { nounwind }
