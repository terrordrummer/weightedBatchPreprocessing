// ----------------------------------------------------------------------------
// PixInsight JavaScript Runtime API - PJSR Version 1.0
// ----------------------------------------------------------------------------
// WeightedBatchPreprocessing-global.js - Released 2018-11-30T21:29:47Z
// ----------------------------------------------------------------------------
//
// This file is part of Weighted Batch Preprocessing Script version 1.3.5
//
// Copyright (c) 2012 Kai Wiechen
// Copyright (c) 2018 Roberto Sartori
// Copyright (c) 2018 Tommaso Rubechi
// Copyright (c) 2012-2018 Pleiades Astrophoto S.L.
//
// Redistribution and use in both source and binary forms, with or without
// modification, is permitted provided that the following conditions are met:
//
// 1. All redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
//
// 2. All redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
//
// 3. Neither the names "PixInsight" and "Pleiades Astrophoto", nor the names
//    of their contributors, may be used to endorse or promote products derived
//    from this software without specific prior written permission. For written
//    permission, please contact info@pixinsight.com.
//
// 4. All products derived from this software, in any form whatsoever, must
//    reproduce the following acknowledgment in the end-user documentation
//    and/or other materials provided with the product:
//
//    "This product is based on software from the PixInsight project, developed
//    by Pleiades Astrophoto and its contributors (http://pixinsight.com/)."
//
//    Alternatively, if that is where third-party acknowledgments normally
//    appear, this acknowledgment must be reproduced in the product itself.
//
// THIS SOFTWARE IS PROVIDED BY PLEIADES ASTROPHOTO AND ITS CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
// TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
// PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL PLEIADES ASTROPHOTO OR ITS
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
// EXEMPLARY OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, BUSINESS
// INTERRUPTION; PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; AND LOSS OF USE,
// DATA OR PROFITS) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
// ----------------------------------------------------------------------------

/*
 * Global declarations and variables
 */

// ----------------------------------------------------------------------------

/* beautify ignore:start */

#define VERSION "1.3.5"

#define TITLE "Weighted Batch Preprocessing Script"

#define SETTINGS_KEY_BASE "WeightedBatchPreprocessing/"

#define WEIGHT_KEYWORD "WBPPWGHT"

var ImageType = {
  UNKNOWN: -1,
  BIAS: 0,
  DARK: 1,
  FLAT: 2,
  LIGHT: 3
};

ImageIntegration.prototype.auto = 999;

// Default parameters
#define DEFAULT_SAVE_FRAME_GROUPS                     false
#define DEFAULT_OUTPUT_DIRECTORY                      ""
#define DEFAULT_CFA_IMAGES                            false
#define DEFAULT_UP_BOTTOM_FITS                        true
#define DEFAULT_EXPORT_CALIBRATION_FILES              true
#define DEFAULT_SAVE_PROCESS_LOG                      true
#define DEFAULT_GENERATE_REJECTION_MAPS               true

#define DEFAULT_OPTIMIZE_DARKS                        true
#define DEFAULT_DARK_OPTIMIZATION_LOW                 3.0
#define DEFAULT_DARK_OPTIMIZATION_WINDOW              1024
#define DEFAULT_DARK_EXPOSURE_TOLERANCE               10

#define DEFAULT_EVALUATE_NOISE                        true

#define DEFAULT_REJECTION_METHOD                      ImageIntegration.prototype.auto

#define DEFAULT_FLAT_DARKS_ONLY                       true
#define DEFAULT_FLATS_LARGE_SCALE_REJECTION           false
#define DEFAULT_FLATS_LARGE_SCALE_LAYERS              2
#define DEFAULT_FLATS_LARGE_SCALE_GROWTH              2

#define DEFAULT_CALIBRATE_ONLY                        false
#define DEFAULT_LIGHT_EXPOSURE_TOLERANCE              2
#define DEFAULT_GROUP_LIGHTS_WITH_DIFFERENT_EXPOSURE  false
#define DEFAULT_GENERATE_DRIZZLE_DATA                 true

#define DEFAULT_COSMETIC_CORRECTION                   false
#define DEFAULT_COSMETIC_CORRECTION_TEMPLATE          ""

#define DEFAULT_CFA_PATTERN                           Debayer.prototype.Auto
#define DEFAULT_DEBAYER_METHOD                        Debayer.prototype.VNG

#define DEFAULT_SUBFRAMEWEIGHTING_PRESET              1
#define DEFAULT_SUBFRAMEWEIGHTING_GENERATE            false
#define DEFAULT_SUBFRAMEWEIGHTING_GENERATE_AFTER_REGISTRATION false
#define DEFAULT_SUBFRAMEWEIGHTING_BEST_REFERENCE              false

#define DEFAULT_SUBFRAMEWEIGHTING_FWHM_WEIGHT                 5
#define DEFAULT_SUBFRAMEWEIGHTING_ECCENTRICITY_WEIGHT         10
#define DEFAULT_SUBFRAMEWEIGHTING_SNR_WEIGHT                  20
#define DEFAULT_SUBFRAMEWEIGHTING_PEDESTAL                    65

#define DEFAULT_SA_PIXEL_INTERPOLATION      StarAlignment.prototype.Auto
#define DEFAULT_SA_CLAMPING_THRESHOLD       0.3
#define DEFAULT_SA_MAX_STARS                500
#define DEFAULT_SA_DISTORTION_CORRECTION    false
#define DEFAULT_SA_NOISE_REDUCTION          0
#define DEFAULT_SA_USE_TRIANGLE_SIMILARITY  true

#define DEFAULT_INTEGRATE true

#define DEFAULT_FRAME_GROUPS []

// CONSTANTS

#define CONST_MIN_EXPOSURE_TOLERANCE 0.01
#define CONST_FLAT_DARK_TOLERANCE 0.5

/* beautify ignore:end */

// ----------------------------------------------------------------------------
// EOF WeightedBatchPreprocessing-global.js - Released 2018-11-30T21:29:47Z
