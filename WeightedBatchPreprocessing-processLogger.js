// ----------------------------------------------------------------------------
// PixInsight JavaScript Runtime API - PJSR Version 1.0
// ----------------------------------------------------------------------------
// WeightedBatchPreprocessing-processLogger.js - Released 2018-11-30T21:29:47Z
// ----------------------------------------------------------------------------
//
// This file is part of Weighted Batch Preprocessing Script version 1.3.4
//
// Copyright (c) 2018 Roberto Sartori
// Copyright (c) 2012-2019 Pleiades Astrophoto S.L.
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

/* beautify ignore:start */
#include <pjsr/StdDialogCode.jsh>
/* beautify ignore:end */

// ----------------------------------------------------------------------------

function ProcessLogger()
{
  this.__base__ = Object;
  this.__base__();

  this.messages = new Array;

  this.clean = function()
  {
    this.messages = [];
  }

  this.addSuccess = function( title, msg )
  {
    this.messages.push(
    {
      type: 'success',
      title: title,
      msg: msg
    } );
  }

  this.addMessage = function( msg )
  {
    this.messages.push(
    {
      type: 'message',
      msg: msg
    } );
  }

  this.addWarning = function( msg )
  {
    this.messages.push(
    {
      type: 'warning',
      msg: msg
    } );
  }

  this.addError = function( msg )
  {
    this.messages.push(
    {
      type: 'error',
      msg: msg
    } );
  }

  this.newLine = function()
  {
    this.addMessage( "" );
  }

  this.toString = function()
  {
    var str = "";
    for ( let i = 0; i < this.messages.length; ++i )
    {
      let type = this.messages[ i ].type;
      let title = this.messages[ i ].title != undefined ? this.messages[ i ].title : "";
      let msg = this.messages[ i ].msg != undefined && this.messages[ i ].msg.length > 0 ? this.messages[ i ].msg : "";

      switch ( type )
      {
        case 'success':
          str += "<b><color=green>" + title + '</color></b>' + ( ( msg != null && !msg.isEmpty() ) ? ': ' : '' ) + msg + "\n";
          break;
        case 'message':
          str += msg + "\n";
          break;
        case 'warning':
          str += "<b><color=orange>*** Warning</color></b>: " + this.messages[ i ].msg + "\n";
          break;
        case 'error':
          str += "<b><color=red>!!! Error: " + this.messages[ i ].msg + "</color></b>\n";
          break;
      }
    }
    return str;
  }
}

ProcessLogger.prototype = new Object;
