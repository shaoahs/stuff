/* Copyright (c) 2011 The WebM project authors. All Rights Reserved. */
/*  */
/* Use of this source code is governed by a BSD-style license */
/* that can be found in the LICENSE file in the root of the source */
/* tree. An additional intellectual property rights grant can be found */
/* in the file PATENTS.  All contributing project authors may */
/* be found in the AUTHORS file in the root of the source tree. */
#include "vpx/vpx_codec.h"
static const char* const cfg = "--prefix=/home/dott/ogv.js/build/wasm-mt/root --target=generic-gnu --extra-cflags=-pthread -s USE_PTHREADS=1 -I/home/dott/emsdk/upstream/emscripten/system/lib/libcxxabi/include/ --enable-multithread --enable-vp9-decoder --disable-vp8-encoder --disable-vp9-encoder --disable-shared --disable-docs --disable-examples --disable-tools --disable-unit-tests";
const char *vpx_codec_build_config(void) {return cfg;}
