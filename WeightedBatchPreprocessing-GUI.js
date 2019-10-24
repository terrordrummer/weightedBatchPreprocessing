// ----------------------------------------------------------------------------
// PixInsight JavaScript Runtime API - PJSR Version 1.0
// ----------------------------------------------------------------------------
// WeightedBatchPreprocessing-GUI.js - Released 2018-11-30T21:29:47Z
// ----------------------------------------------------------------------------
//
// This file is part of Weighted Batch Preprocessing Script version 1.2.0
//
// Copyright (c) 2012 Kai Wiechen
// Copyright (c) 2018 Roberto Sartori
// Copyright (c) 2018 Tommaso Rubechi
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

/*
 * Graphical user interface
 */

/* beautify ignore:start */

#include <pjsr/Color.jsh>
#include <pjsr/DataType.jsh>

/* beautify ignore:end */

// ----------------------------------------------------------------------------

function StyledTreeBox( parent )
{
  this.__base__ = TreeBox;
  if ( parent )
    this.__base__( parent );
  else
    this.__base__();

  this.alternateRowColor = true;
}

StyledTreeBox.prototype = new TreeBox;

// ----------------------------------------------------------------------------

function ParametersControl( title, parent, expand )
{
  this.__base__ = Control;
  if ( parent )
  {
    this.__base__( parent );
    if ( !parent.parameterControls )
      parent.parameterControls = new Array;
    parent.parameterControls.push( this );
  }
  else
    this.__base__();

  if ( expand )
  {
    this.expand = expand;
    this.hide();
  }
  else
    this.expand = false;

  var r = Color.red( this.dialog.backgroundColor );
  var g = Color.green( this.dialog.backgroundColor );
  var b = Color.blue( this.dialog.backgroundColor );
  var r1 = ( r > 16 ) ? r - 16 : r + 16;
  var g1 = ( g > 16 ) ? g - 16 : g + 16;
  var b1 = ( b > 16 ) ? b - 16 : b + 16;

  // Force this generic control (=QWidget) to inherit its dialog's font.
  this.font = this.dialog.font;

  this.titleLabel = new Label( this );
  this.titleLabel.text = title ? title : "";
  this.titleLabel.textAlignment = TextAlign_Left | TextAlign_VertCenter;

  if ( this.expand )
  {
    this.closeButton = new ToolButton( this );
    this.closeButton.icon = this.scaledResource( ":/icons/close.png" );
    this.closeButton.setScaledFixedSize( 20, 20 );
    this.closeButton.toolTip = "Back";
    this.closeButton.onClick = function()
    {
      this.parent.parent.hide();
    };
  }
  else
    this.closeButton = null;

  this.titleBar = new Control( this );
  this.titleBar.styleSheet = this.scaledStyleSheet(
    "QWidget#" + this.titleBar.uniqueId + " {" +
    "border: 1px solid gray;" +
    "border-bottom: none;" +
    "background-color: " + Color.rgbColorToHexString( Color.rgbaColor( r1, g1, b1 ) ) + ";" +
    "}" +
    "QLabel {" +
    "color: blue;" +
    "padding-top: 2px;" +
    "padding-bottom: 2px;" +
    "padding-left: 4px;" +
    "}" +
    "QLabel:disabled {" +
    "color: gray;" +
    "}" );
  this.titleBar.sizer = new HorizontalSizer;
  this.titleBar.sizer.add( this.titleLabel );
  this.titleBar.sizer.addStretch();
  if ( this.expand )
  {
    this.titleBar.sizer.add( this.closeButton );
    this.titleBar.sizer.addSpacing( 4 );
  }

  this.contents = new Control( this );
  this.contents.styleSheet = this.scaledStyleSheet(
    "QWidget#" + this.contents.uniqueId + " {" +
    "border: 1px solid gray;" +
    "}" );

  this.contents.sizer = new VerticalSizer;
  this.contents.sizer.margin = 6;
  this.contents.sizer.spacing = 6;
  this.contents.sizer.addSpacing( 8 );

  this.sizer = new VerticalSizer;
  this.sizer.add( this.titleBar );
  this.sizer.add( this.contents );

  this.add = function( control )
  {
    this.contents.sizer.add( control );
  };

  this.onShow = function()
  {
    if ( this.expand )
      for ( var i = 0; i < this.parent.parameterControls.length; ++i )
      {
        var sibling = this.parent.parameterControls[ i ];
        if ( sibling.uniqueId != this.uniqueId )
          sibling.hide();
      }
  };

  this.onHide = function()
  {
    if ( this.expand )
      for ( var i = 0; i < this.parent.parameterControls.length; ++i )
      {
        var sibling = this.parent.parameterControls[ i ];
        if ( !sibling.expand && sibling.uniqueId != this.uniqueId )
          sibling.show();
      }
  };
}

ParametersControl.prototype = new Control;

// ----------------------------------------------------------------------------

function OverscanRectControl( parent, overscan, sourceRegion )
{
  this.__base__ = Control;
  if ( parent )
    this.__base__( parent );
  else
    this.__base__();

  var editWidth1 = 7 * this.font.width( "0" );

  this.label = new Label( this );
  this.label.text = ( ( overscan < 0 ) ? "Image" : ( sourceRegion ? "Source" : "Target" ) ) + " region:";
  this.label.minWidth = this.dialog.labelWidth1;
  this.label.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  var fullName = "Overscan " + ( ( overscan < 0 ) ? "image" : "#" + ( overscan + 1 ).toString() + ( sourceRegion ? " source" : " target" ) ) + " region";

  this.leftControl = new NumericEdit( this );
  this.leftControl.overscan = overscan;
  this.leftControl.sourceRegion = sourceRegion;
  this.leftControl.label.hide();
  this.leftControl.setReal( false );
  this.leftControl.setRange( 0, 9999999 )
  this.leftControl.edit.setFixedWidth( editWidth1 );
  this.leftControl.toolTip = "<p>Left coordinate of the " + fullName + " in CCD pixels.</p>"
  this.leftControl.onValueUpdated = function( value )
  {
    var ivalue = Math.trunc( value );
    if ( this.overscan < 0 )
      engine.overscan.imageRect.x0 = ivalue;
    else if ( this.sourceRegion )
      engine.overscan.overscan[ this.overscan ].sourceRect.x0 = ivalue;
    else
      engine.overscan.overscan[ this.overscan ].targetRect.x0 = ivalue;
  };

  this.topControl = new NumericEdit( this );
  this.topControl.overscan = overscan;
  this.topControl.sourceRegion = sourceRegion;
  this.topControl.label.hide();
  this.topControl.setReal( false );
  this.topControl.setRange( 0, 9999999 )
  this.topControl.edit.setFixedWidth( editWidth1 );
  this.topControl.toolTip = "<p>Top coordinate of the " + fullName + " in CCD pixels.</p>"
  this.topControl.onValueUpdated = function( value )
  {
    var ivalue = Math.trunc( value );
    if ( this.overscan < 0 )
      engine.overscan.imageRect.y0 = ivalue;
    else if ( this.sourceRegion )
      engine.overscan.overscan[ this.overscan ].sourceRect.y0 = ivalue;
    else
      engine.overscan.overscan[ this.overscan ].targetRect.y0 = ivalue;
  };

  this.widthControl = new NumericEdit( this );
  this.widthControl.overscan = overscan;
  this.widthControl.sourceRegion = sourceRegion;
  this.widthControl.label.hide();
  this.widthControl.setReal( false );
  this.widthControl.setRange( 0, 9999999 )
  this.widthControl.edit.setFixedWidth( editWidth1 );
  this.widthControl.toolTip = "<p>Width of the " + fullName + " in CCD pixels.</p>"
  this.widthControl.onValueUpdated = function( value )
  {
    var ivalue = Math.trunc( value );
    if ( this.overscan < 0 )
      engine.overscan.imageRect.x1 = engine.overscan.imageRect.x0 + ivalue;
    else if ( this.sourceRegion )
      engine.overscan.overscan[ this.overscan ].sourceRect.x1 = engine.overscan.overscan[ this.overscan ].sourceRect.x0 + ivalue;
    else
      engine.overscan.overscan[ this.overscan ].targetRect.x1 = engine.overscan.overscan[ this.overscan ].targetRect.x0 + ivalue;
  };

  this.heightControl = new NumericEdit( this );
  this.heightControl.overscan = overscan;
  this.heightControl.sourceRegion = sourceRegion;
  this.heightControl.label.hide();
  this.heightControl.setReal( false );
  this.heightControl.setRange( 0, 9999999 )
  this.heightControl.edit.setFixedWidth( editWidth1 );
  this.heightControl.toolTip = "<p>Height of the " + fullName + " in CCD pixels.</p>"
  this.heightControl.onValueUpdated = function( value )
  {
    var ivalue = Math.trunc( value );
    if ( this.overscan < 0 )
      engine.overscan.imageRect.y1 = engine.overscan.imageRect.y0 + ivalue;
    else if ( this.sourceRegion )
      engine.overscan.overscan[ this.overscan ].sourceRect.y1 = engine.overscan.overscan[ this.overscan ].sourceRect.y0 + ivalue;
    else
      engine.overscan.overscan[ this.overscan ].targetRect.y1 = engine.overscan.overscan[ this.overscan ].targetRect.y0 + ivalue;
  };

  this.toolTip = "<p>" + fullName + ".</p>";

  this.sizer = new HorizontalSizer;
  this.sizer.spacing = 4;
  this.sizer.add( this.label );
  this.sizer.add( this.leftControl );
  this.sizer.add( this.topControl );
  this.sizer.add( this.widthControl );
  this.sizer.add( this.heightControl );
  this.sizer.addStretch();
}

OverscanRectControl.prototype = new Control;

// ----------------------------------------------------------------------------

function OverscanRegionControl( parent, overscan )
{
  this.__base__ = Control;
  if ( parent )
    this.__base__( parent );
  else
    this.__base__();

  if ( overscan < 0 )
  {
    this.imageRectControl = new OverscanRectControl( this, overscan, false );

    this.sizer = new VerticalSizer;
    this.sizer.add( this.imageRectControl );
  }
  else
  {
    this.applyCheckBox = new CheckBox( this );
    this.applyCheckBox.overscan = overscan;
    this.applyCheckBox.text = "Overscan #" + ( overscan + 1 ).toString();
    this.applyCheckBox.toolTip = "<p>Enable overscan region #" + ( overscan + 1 ).toString() + ".</p>";
    this.applyCheckBox.onCheck = function( checked )
    {
      engine.overscan.overscan[ this.overscan ].enabled = checked;
      var biasPage = this.dialog.tabBox.pageControlByIndex( ImageType.BIAS );
      biasPage.overscanControl.updateControls();
    };

    this.applySizer = new HorizontalSizer;
    this.applySizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
    this.applySizer.add( this.applyCheckBox );
    this.applySizer.addStretch();

    this.sourceRectControl = new OverscanRectControl( this, overscan, true );
    this.targetRectControl = new OverscanRectControl( this, overscan, false );

    this.sizer = new VerticalSizer;
    this.sizer.spacing = 4;
    this.sizer.add( this.applySizer );
    this.sizer.add( this.sourceRectControl );
    this.sizer.add( this.targetRectControl );
  }
}

OverscanRegionControl.prototype = new Control;

// ----------------------------------------------------------------------------

function OverscanControl( parent, expand )
{
  this.__base__ = ParametersControl;
  this.__base__( "Overscan", parent, expand );

  //

  this.imageControl = new OverscanRegionControl( this, -1 );
  this.overscanControls = new Array;
  this.overscanControls.push( new OverscanRegionControl( this, 0 ) );
  this.overscanControls.push( new OverscanRegionControl( this, 1 ) );
  this.overscanControls.push( new OverscanRegionControl( this, 2 ) );
  this.overscanControls.push( new OverscanRegionControl( this, 3 ) );

  this.add( this.imageControl );
  this.add( this.overscanControls[ 0 ] );
  this.add( this.overscanControls[ 1 ] );
  this.add( this.overscanControls[ 2 ] );
  this.add( this.overscanControls[ 3 ] );

  this.updateControls = function()
  {
    this.imageControl.imageRectControl.leftControl.setValue( engine.overscan.imageRect.x0 );
    this.imageControl.imageRectControl.topControl.setValue( engine.overscan.imageRect.y0 );
    this.imageControl.imageRectControl.widthControl.setValue( engine.overscan.imageRect.width );
    this.imageControl.imageRectControl.heightControl.setValue( engine.overscan.imageRect.height );

    for ( var i = 0; i < 4; ++i )
    {
      var enabled = engine.overscan.overscan[ i ].enabled;
      this.overscanControls[ i ].applyCheckBox.checked = enabled;
      this.overscanControls[ i ].sourceRectControl.leftControl.setValue( engine.overscan.overscan[ i ].sourceRect.x0 );
      this.overscanControls[ i ].sourceRectControl.topControl.setValue( engine.overscan.overscan[ i ].sourceRect.y0 );
      this.overscanControls[ i ].sourceRectControl.widthControl.setValue( engine.overscan.overscan[ i ].sourceRect.width );
      this.overscanControls[ i ].sourceRectControl.heightControl.setValue( engine.overscan.overscan[ i ].sourceRect.height );
      this.overscanControls[ i ].sourceRectControl.enabled = enabled;
      this.overscanControls[ i ].targetRectControl.leftControl.setValue( engine.overscan.overscan[ i ].targetRect.x0 );
      this.overscanControls[ i ].targetRectControl.topControl.setValue( engine.overscan.overscan[ i ].targetRect.y0 );
      this.overscanControls[ i ].targetRectControl.widthControl.setValue( engine.overscan.overscan[ i ].targetRect.width );
      this.overscanControls[ i ].targetRectControl.heightControl.setValue( engine.overscan.overscan[ i ].targetRect.height );
      this.overscanControls[ i ].targetRectControl.enabled = enabled;
    }

    this.contents.enabled = engine.overscan.enabled;
  };

  this.parentOnShow = this.onShow;

  this.onShow = function()
  {
    var biasPage = this.dialog.tabBox.pageControlByIndex( ImageType.BIAS );
    this.setFixedWidth( biasPage.imageIntegrationControl.width );
    this.parentOnShow();
  };
}

OverscanControl.prototype = new Control;

// ----------------------------------------------------------------------------

function BiasOverscanControl( parent )
{
  this.__base__ = ParametersControl;
  this.__base__( "Overscan", parent );

  //

  this.applyCheckBox = new CheckBox( this );
  this.applyCheckBox.text = "Apply";
  this.applyCheckBox.toolTip = "<p>Apply overscan correction.</p>";
  this.applyCheckBox.onCheck = function( checked )
  {
    engine.overscan.enabled = checked;
    var biasPage = this.dialog.tabBox.pageControlByIndex( ImageType.BIAS );
    biasPage.biasOverscanControl.updateControls();
    biasPage.overscanControl.updateControls();
  };

  this.applySizer = new HorizontalSizer;
  this.applySizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.applySizer.add( this.applyCheckBox );
  this.applySizer.addStretch();

  //

  this.editButton = new PushButton( this );
  this.editButton.text = "Overscan parameters...";
  this.editButton.icon = this.scaledResource( ":/icons/arrow-right.png" );
  this.editButton.toolTip = "<p>Edit overscan parameters.</p>";
  this.editButton.onClick = function()
  {
    var biasPage = this.dialog.tabBox.pageControlByIndex( ImageType.BIAS );
    biasPage.overscanControl.show();
  };

  this.editSizer = new HorizontalSizer;
  this.editSizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.editSizer.add( this.editButton );
  this.editSizer.addStretch();

  //

  this.add( this.applySizer );
  this.add( this.editSizer );

  this.updateControls = function()
  {
    this.applyCheckBox.checked = engine.overscan.enabled;
    this.editButton.enabled = engine.overscan.enabled;
  };
}

BiasOverscanControl.prototype = new Control;

// ----------------------------------------------------------------------------

function ImageIntegrationControl( parent, imageType, expand )
{
  this.__base__ = ParametersControl;
  this.__base__( "Image Integration", parent, expand );

  this.imageType = imageType;

  //

  this.combinationLabel = new Label( this );
  this.combinationLabel.text = "Combination:";
  this.combinationLabel.minWidth = this.dialog.labelWidth1;
  this.combinationLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  this.combinationComboBox = new ComboBox( this );
  this.combinationComboBox.addItem( "Average" );
  this.combinationComboBox.addItem( "Median" );
  this.combinationComboBox.addItem( "Minimum" );
  this.combinationComboBox.addItem( "Maximum" );
  this.combinationComboBox.onItemSelected = function( item )
  {
    engine.combination[ this.parent.parent.imageType ] = item;
  };

  this.combinationLabel.toolTip = this.combinationComboBox.toolTip =
    "<p><b>Average</b> combination provides the best signal-to-noise ratio in the integrated result.</p>" +
    "<p><b>Median</b> combination provides more robust rejection of outliers, but at the cost of more noise.</p>";

  this.combinationSizer = new HorizontalSizer;
  this.combinationSizer.spacing = 4;
  this.combinationSizer.add( this.combinationLabel );
  this.combinationSizer.add( this.combinationComboBox, 100 );

  //

  this.rejectionAlgorithmLabel = new Label( this );
  this.rejectionAlgorithmLabel.text = "Rejection algorithm:";
  this.rejectionAlgorithmLabel.minWidth = this.dialog.labelWidth1;
  this.rejectionAlgorithmLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  this.rejectionAlgorithmComboBox = new ComboBox( this );
  this.rejectionAlgorithmComboBox.addItem( "No rejection" );
  this.rejectionAlgorithmComboBox.addItem( "Min/Max" );
  this.rejectionAlgorithmComboBox.addItem( "Percentile Clipping" );
  this.rejectionAlgorithmComboBox.addItem( "Sigma Clipping" );
  this.rejectionAlgorithmComboBox.addItem( "Winsorized Sigma Clipping" );
  this.rejectionAlgorithmComboBox.addItem( "Averaged Sigma Clipping" );
  this.rejectionAlgorithmComboBox.addItem( "Linear Fit Clipping" );
  this.rejectionAlgorithmComboBox.addItem( "Auto" );
  this.rejectionAlgorithmComboBox.onItemSelected = function( item )
  {
    engine.rejection[ this.parent.parent.imageType ] = item;
    this.parent.parent.updateControls();
  };

  this.rejectionAlgorithmLabel.toolTip = this.rejectionAlgorithmComboBox.toolTip =
    "<p>The <b>iterative sigma clipping</b> algorithm is usually a good option to integrate more than " +
    "10 or 15 images. Keep in mind that for sigma clipping to work, the standard deviation must be a good " +
    "estimate of dispersion, which requires a sufficient number of pixels per stack (the more images the " +
    "better).</p>" +
    "<p><b>Winsorized sigma clipping</b> is similar to the normal sigma clipping algorithm, but uses a " +
    "special iterative procedure based on Huber's method of robust estimation of parameters through " +
    "<i>Winsorization</i>. This algorithm can yield superior rejection of outliers with better preservation " +
    "of significant data for large sets of images.</p>" +
    "<p><b>Percentile clipping</b> rejection is excellent to integrate reduced sets of images, such as " +
    "3 to 6 images. This is a single-pass algorithm that rejects pixels outside a fixed range of values " +
    "relative to the median of each pixel stack.</p>" +
    "<p><b>Averaged iterative sigma clipping</b> is intended for sets of 10 or more images. This algorithm " +
    "tries to derive the gain of an ideal CCD detector from existing pixel data, assuming zero readout noise, " +
    "then uses a Poisson noise model to perform rejection. For large sets of images however, sigma clipping " +
    "tends to be superior.</p>" +
    "<p><b>Linear fit clipping</b> fits each pixel stack to a straigtht line. The linear fit is optimized " +
    "in the twofold sense of minimizing average absolute deviation and maximizing inliers. This rejection " +
    "algorithm is more robust than sigma clipping for large sets of images, especially in presence of " +
    "additive sky gradients of varying intensity and spatial distribution. For the best performance, use " +
    "this algorithm for large sets of at least 15 images. Five images is the minimum required.</p>" +
    "<p>The <b>min/max</b> method can be used to ensure rejection of extreme values. Min/max performs an " +
    "unconditional rejection of a fixed number of pixels from each stack, without any statistical basis. " +
    "Rejection methods based on robust statistics, such as percentile, Winsorized sigma clipping, linear " +
    "fitting and averaged sigma clipping are in general preferable.</p>" +
    "<p><b>Auto</b> selects the best algorithm depending on the amount of images in the group: ";

  this.rejectionAlgorithmSizer = new HorizontalSizer;
  this.rejectionAlgorithmSizer.spacing = 4;
  this.rejectionAlgorithmSizer.add( this.rejectionAlgorithmLabel );
  this.rejectionAlgorithmSizer.add( this.rejectionAlgorithmComboBox, 100 );

  //

  this.minMaxLowLabel = new Label( this );
  this.minMaxLowLabel.text = "Min/Max low:";
  this.minMaxLowLabel.minWidth = this.dialog.labelWidth1;
  this.minMaxLowLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  this.minMaxLowSpinBox = new SpinBox( this );
  this.minMaxLowSpinBox.minValue = 0;
  this.minMaxLowSpinBox.maxValue = 100;
  this.minMaxLowSpinBox.setFixedWidth( this.dialog.numericEditWidth + this.logicalPixelsToPhysical( 16 ) );
  this.minMaxLowSpinBox.toolTip = "<p>Number of low (dark) pixels to be rejected by the min/max algorithm.</p>";
  this.minMaxLowSpinBox.onValueUpdated = function( value )
  {
    engine.minMaxLow[ this.parent.parent.imageType ] = value;
  };

  this.minMaxLowLabel.toolTip = this.minMaxLowSpinBox.toolTip =
    "<p>Number of low (dark) pixels to be rejected by the min/max algorithm.</p>";

  this.minMaxLowSizer = new HorizontalSizer;
  this.minMaxLowSizer.spacing = 4;
  this.minMaxLowSizer.add( this.minMaxLowLabel );
  this.minMaxLowSizer.add( this.minMaxLowSpinBox );
  this.minMaxLowSizer.addStretch();

  //

  this.minMaxHighLabel = new Label( this );
  this.minMaxHighLabel.text = "Min/Max high:";
  this.minMaxHighLabel.minWidth = this.dialog.labelWidth1;
  this.minMaxHighLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  this.minMaxHighSpinBox = new SpinBox( this );
  this.minMaxHighSpinBox.minValue = 0;
  this.minMaxHighSpinBox.maxValue = 100;
  this.minMaxHighSpinBox.setFixedWidth( this.dialog.numericEditWidth + this.logicalPixelsToPhysical( 16 ) );
  this.minMaxHighSpinBox.toolTip = "<p>Number of high (bright) pixels to be rejected by the min/max algorithm.</p>";
  this.minMaxHighSpinBox.onValueUpdated = function( value )
  {
    engine.minMaxHigh[ this.parent.parent.imageType ] = value;
  };

  this.minMaxHighLabel.toolTip = this.minMaxHighSpinBox.toolTip =
    "<p>Number of high (bright) pixels to be rejected by the min/max algorithm.</p>";

  this.minMaxHighSizer = new HorizontalSizer;
  this.minMaxHighSizer.spacing = 4;
  this.minMaxHighSizer.add( this.minMaxHighLabel );
  this.minMaxHighSizer.add( this.minMaxHighSpinBox );
  this.minMaxHighSizer.addStretch();

  //

  this.percentileLowControl = new NumericControl( this );
  this.percentileLowControl.label.text = "Percentile low:";
  this.percentileLowControl.label.minWidth = this.dialog.labelWidth1;
  this.percentileLowControl.setRange( 0, 1 );
  this.percentileLowControl.slider.setRange( 0, 1000 );
  this.percentileLowControl.slider.scaledMinWidth = 200;
  this.percentileLowControl.setPrecision( 2 );
  this.percentileLowControl.edit.setFixedWidth( this.dialog.numericEditWidth );
  this.percentileLowControl.toolTip = "<p>Low clipping factor for the percentile clipping rejection algorithm.</p>";
  this.percentileLowControl.onValueUpdated = function( value )
  {
    engine.percentileLow[ this.parent.parent.imageType ] = value;
  };

  //

  this.percentileHighControl = new NumericControl( this );
  this.percentileHighControl.label.text = "Percentile high:";
  this.percentileHighControl.label.minWidth = this.dialog.labelWidth1;
  this.percentileHighControl.setRange( 0, 1 );
  this.percentileHighControl.slider.setRange( 0, 1000 );
  this.percentileHighControl.slider.scaledMinWidth = 200;
  this.percentileHighControl.setPrecision( 2 );
  this.percentileHighControl.edit.setFixedWidth( this.dialog.numericEditWidth );
  this.percentileHighControl.toolTip = "<p>High clipping factor for the percentile clipping rejection algorithm.</p>";
  this.percentileHighControl.onValueUpdated = function( value )
  {
    engine.percentileHigh[ this.parent.parent.imageType ] = value;
  };

  //

  this.sigmaLowControl = new NumericControl( this );
  this.sigmaLowControl.label.text = "Sigma low:";
  this.sigmaLowControl.label.minWidth = this.dialog.labelWidth1;
  this.sigmaLowControl.setRange( 0, 10 );
  this.sigmaLowControl.slider.setRange( 0, 1000 );
  this.sigmaLowControl.slider.scaledMinWidth = 200;
  this.sigmaLowControl.setPrecision( 2 );
  this.sigmaLowControl.setValue( 4.0 );
  this.sigmaLowControl.edit.setFixedWidth( this.dialog.numericEditWidth );
  this.sigmaLowControl.toolTip = "<p>Low clipping factor for the sigma clipping rejection algorithms.</p>";
  this.sigmaLowControl.onValueUpdated = function( value )
  {
    engine.sigmaLow[ this.parent.parent.imageType ] = value;
  };

  //

  this.sigmaHighControl = new NumericControl( this );
  this.sigmaHighControl.label.text = "Sigma high:";
  this.sigmaHighControl.label.minWidth = this.dialog.labelWidth1;
  this.sigmaHighControl.setRange( 0, 10 );
  this.sigmaHighControl.slider.setRange( 0, 1000 );
  this.sigmaHighControl.slider.scaledMinWidth = 200;
  this.sigmaHighControl.setPrecision( 2 );
  this.sigmaHighControl.setValue( 2.0 );
  this.sigmaHighControl.edit.setFixedWidth( this.dialog.numericEditWidth );
  this.sigmaHighControl.toolTip = "<p>High clipping factor for the sigma clipping rejection algorithms.</p>";
  this.sigmaHighControl.onValueUpdated = function( value )
  {
    engine.sigmaHigh[ this.parent.parent.imageType ] = value;
  };

  //

  this.linearFitLowControl = new NumericControl( this );
  this.linearFitLowControl.label.text = "Linear fit low:";
  this.linearFitLowControl.label.minWidth = this.dialog.labelWidth1;
  this.linearFitLowControl.setRange( 0, 10 );
  this.linearFitLowControl.slider.setRange( 0, 1000 );
  this.linearFitLowControl.slider.scaledMinWidth = 200;
  this.linearFitLowControl.setPrecision( 2 );
  this.linearFitLowControl.setValue( 5.0 );
  this.linearFitLowControl.edit.setFixedWidth( this.dialog.numericEditWidth );
  this.linearFitLowControl.toolTip = "<p>Low clipping factor for the linear fit clipping rejection algorithm.</p>";
  this.linearFitLowControl.onValueUpdated = function( value )
  {
    engine.linearFitLow[ this.parent.parent.imageType ] = value;
  };

  //

  this.linearFitHighControl = new NumericControl( this );
  this.linearFitHighControl.label.text = "Linear fit high:";
  this.linearFitHighControl.label.minWidth = this.dialog.labelWidth1;
  this.linearFitHighControl.setRange( 0, 10 );
  this.linearFitHighControl.slider.setRange( 0, 1000 );
  this.linearFitHighControl.slider.scaledMinWidth = 200;
  this.linearFitHighControl.setPrecision( 2 );
  this.linearFitHighControl.setValue( 2.5 );
  this.linearFitHighControl.edit.setFixedWidth( this.dialog.numericEditWidth );
  this.linearFitHighControl.toolTip = "<p>High clipping factor for the linear fit clipping rejection algorithm.</p>";
  this.linearFitHighControl.onValueUpdated = function( value )
  {
    engine.linearFitHigh[ this.parent.parent.imageType ] = value;
  };

  //

  this.add( this.combinationSizer );
  this.add( this.rejectionAlgorithmSizer );
  this.add( this.minMaxLowSizer );
  this.add( this.minMaxHighSizer );
  this.add( this.percentileLowControl );
  this.add( this.percentileHighControl );
  this.add( this.sigmaLowControl );
  this.add( this.sigmaHighControl );
  this.add( this.linearFitLowControl );
  this.add( this.linearFitHighControl );

  if ( this.imageType == ImageType.FLAT )
  {
    this.largeScaleRejectionCheckBox = new CheckBox( this );
    this.largeScaleRejectionCheckBox.text = "Large-scale pixel rejection";
    this.largeScaleRejectionCheckBox.toolTip = "<p>Apply large-scale pixel rejection, high pixel sample values. " +
      "Useful to improve rejection of stars for integration of sky flats.</p>";
    this.largeScaleRejectionCheckBox.onCheck = function( checked )
    {
      engine.flatsLargeScaleRejection = checked;
      this.parent.parent.updateControls();
    };

    this.largeScaleRejectionSizer = new HorizontalSizer;
    this.largeScaleRejectionSizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
    this.largeScaleRejectionSizer.add( this.largeScaleRejectionCheckBox );
    this.largeScaleRejectionSizer.addStretch();

    //

    this.largeScaleRejectionLayersLabel = new Label( this );
    this.largeScaleRejectionLayersLabel.text = "Large-scale layers:";
    this.largeScaleRejectionLayersLabel.minWidth = this.dialog.labelWidth1;
    this.largeScaleRejectionLayersLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

    this.largeScaleRejectionLayersSpinBox = new SpinBox( this );
    this.largeScaleRejectionLayersSpinBox.minValue = 1;
    this.largeScaleRejectionLayersSpinBox.maxValue = 6;
    this.largeScaleRejectionLayersSpinBox.setFixedWidth( this.dialog.numericEditWidth + this.logicalPixelsToPhysical( 16 ) );
    this.largeScaleRejectionLayersSpinBox.onValueUpdated = function( value )
    {
      engine.flatsLargeScaleRejectionLayers = value;
    };

    this.largeScaleRejectionLayersLabel.toolTip = this.largeScaleRejectionLayersSpinBox.toolTip =
      "<p>Large-scale pixel rejection, number of protected small-scale wavelet layers. " +
      "Increase it to restrict large-scale rejection to larger structures of contiguous rejected pixels.</p>";

    this.largeScaleRejectionLayersSizer = new HorizontalSizer;
    this.largeScaleRejectionLayersSizer.spacing = 4;
    this.largeScaleRejectionLayersSizer.add( this.largeScaleRejectionLayersLabel );
    this.largeScaleRejectionLayersSizer.add( this.largeScaleRejectionLayersSpinBox );
    this.largeScaleRejectionLayersSizer.addStretch();

    //

    this.largeScaleRejectionGrowthLabel = new Label( this );
    this.largeScaleRejectionGrowthLabel.text = "Large-scale growth:";
    this.largeScaleRejectionGrowthLabel.minWidth = this.dialog.labelWidth1;
    this.largeScaleRejectionGrowthLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

    this.largeScaleRejectionGrowthSpinBox = new SpinBox( this );
    this.largeScaleRejectionGrowthSpinBox.minValue = 1;
    this.largeScaleRejectionGrowthSpinBox.maxValue = 20;
    this.largeScaleRejectionGrowthSpinBox.setFixedWidth( this.dialog.numericEditWidth + this.logicalPixelsToPhysical( 16 ) );
    this.largeScaleRejectionGrowthSpinBox.onValueUpdated = function( value )
    {
      engine.flatsLargeScaleRejectionGrowth = value;
    };

    this.largeScaleRejectionGrowthLabel.toolTip = this.largeScaleRejectionGrowthSpinBox.toolTip =
      "<p>Large-scale pixel rejection, growth of large-scale pixel rejection structures. " +
      "Increase to extend rejection to more adjacent pixels.</p>";

    this.largeScaleRejectionGrowthSizer = new HorizontalSizer;
    this.largeScaleRejectionGrowthSizer.spacing = 4;
    this.largeScaleRejectionGrowthSizer.add( this.largeScaleRejectionGrowthLabel );
    this.largeScaleRejectionGrowthSizer.add( this.largeScaleRejectionGrowthSpinBox );
    this.largeScaleRejectionGrowthSizer.addStretch();

    //

    this.add( this.largeScaleRejectionSizer );
    this.add( this.largeScaleRejectionLayersSizer );
    this.add( this.largeScaleRejectionGrowthSizer );
  }

  this.updateControls = function()
  {
    this.combinationComboBox.currentItem = engine.combination[ this.imageType ];
    this.rejectionAlgorithmComboBox.currentItem = engine.rejection[ this.imageType ];
    this.minMaxLowSpinBox.value = engine.minMaxLow[ this.imageType ];
    this.minMaxHighSpinBox.value = engine.minMaxHigh[ this.imageType ];
    this.percentileLowControl.setValue( engine.percentileLow[ this.imageType ] );
    this.percentileHighControl.setValue( engine.percentileHigh[ this.imageType ] );
    this.sigmaLowControl.setValue( engine.sigmaLow[ this.imageType ] );
    this.sigmaHighControl.setValue( engine.sigmaHigh[ this.imageType ] );
    this.linearFitLowControl.setValue( engine.linearFitLow[ this.imageType ] );
    this.linearFitHighControl.setValue( engine.linearFitHigh[ this.imageType ] );

    this.minMaxLowLabel.enabled = false;
    this.minMaxLowSpinBox.enabled = false;
    this.minMaxHighLabel.enabled = false;
    this.minMaxHighSpinBox.enabled = false;
    this.percentileLowControl.enabled = false;
    this.percentileHighControl.enabled = false;
    this.sigmaLowControl.enabled = false;
    this.sigmaHighControl.enabled = false;
    this.linearFitLowControl.enabled = false;
    this.linearFitHighControl.enabled = false;

    switch ( engine.rejection[ this.imageType ] )
    {
      case ImageIntegration.prototype.NoRejection:
        break;
      case ImageIntegration.prototype.MinMax:
        this.minMaxLowLabel.enabled = true;
        this.minMaxLowSpinBox.enabled = true;
        this.minMaxHighLabel.enabled = true;
        this.minMaxHighSpinBox.enabled = true;
        break;
      case ImageIntegration.prototype.PercentileClip:
        this.percentileLowControl.enabled = true;
        this.percentileHighControl.enabled = true;
        break;
      case ImageIntegration.prototype.SigmaClip:
      case ImageIntegration.prototype.WinsorizedSigmaClip:
      case ImageIntegration.prototype.AveragedSigmaClip:
        this.sigmaLowControl.enabled = true;
        this.sigmaHighControl.enabled = true;
        break;
      case ImageIntegration.prototype.LinearFit:
        this.linearFitLowControl.enabled = true;
        this.linearFitHighControl.enabled = true;
        break;
      case ImageIntegration.prototype.LinearFit + 1:
        this.minMaxLowLabel.enabled = true;
        this.minMaxLowSpinBox.enabled = true;
        this.minMaxHighLabel.enabled = true;
        this.minMaxHighSpinBox.enabled = true;
        this.percentileLowControl.enabled = true;
        this.percentileHighControl.enabled = true;
        this.sigmaLowControl.enabled = true;
        this.sigmaHighControl.enabled = true;
        this.linearFitLowControl.enabled = true;
        this.linearFitHighControl.enabled = true;
    }

    if ( this.imageType == ImageType.FLAT )
    {
      this.largeScaleRejectionCheckBox.checked = engine.flatsLargeScaleRejection;
      this.largeScaleRejectionLayersSpinBox.value = engine.flatsLargeScaleRejectionLayers;
      this.largeScaleRejectionGrowthSpinBox.value = engine.flatsLargeScaleRejectionGrowth;

      let enabled = engine.rejection[ this.imageType ] != ImageIntegration.prototype.NoRejection;
      this.largeScaleRejectionCheckBox.enabled = enabled;
      this.largeScaleRejectionLayersSpinBox.enabled = enabled && engine.flatsLargeScaleRejection;
      this.largeScaleRejectionGrowthSpinBox.enabled = enabled && engine.flatsLargeScaleRejection;
    }

    if ( this.imageType != ImageType.LIGHT )
      this.enabled = !engine.useAsMaster[ this.imageType ];
  };
}

ImageIntegrationControl.prototype = new Control;

// ----------------------------------------------------------------------------

function CosmeticCorrectionControl( parent )
{
  this.__base__ = ParametersControl;
  this.__base__( "Cosmetic Correction", parent );

  //

  this.applyCheckBox = new CheckBox( this );
  this.applyCheckBox.text = "Apply";
  this.applyCheckBox.toolTip = "<p>Apply cosmetic correction.</p>";
  this.applyCheckBox.onCheck = function( checked )
  {
    engine.cosmeticCorrection = checked;
    var lightsPage = this.dialog.tabBox.pageControlByIndex( ImageType.LIGHT );
    lightsPage.cosmeticCorrectionControl.updateControls();
  };

  this.applySizer = new HorizontalSizer;
  this.applySizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.applySizer.add( this.applyCheckBox );
  this.applySizer.addStretch();

  //

  var templateIconIdToolTip = "<p>Identifier of an existing CosmeticCorrection icon " +
    "that will be used as a template to apply a cosmetic correction process to the " +
    "calibrated frames. Cosmetic correction will be applied just after calibration, " +
    "before deBayering (when appropriate) and registration.</p>";

  this.templateIconIdLabel = new Label( this );
  this.templateIconIdLabel.text = "Template icon:";
  this.templateIconIdLabel.minWidth = this.dialog.labelWidth1;
  this.templateIconIdLabel.toolTip = templateIconIdToolTip;
  this.templateIconIdLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  this.templateIconIdComboBox = new ComboBox( this );
  this.templateIconIdComboBox.toolTip = templateIconIdToolTip;
  this.templateIconIdComboBox.addItem( "<none>" );
  var icons = ProcessInstance.iconsByProcessId( "CosmeticCorrection" );
  if ( !engine.cosmeticCorrectionTemplateId.isEmpty() )
    if ( !icons.has( engine.cosmeticCorrectionTemplateId ) )
      this.templateIconIdComboBox.addItem( engine.cosmeticCorrectionTemplateId );
  for ( var i = 0; i < icons.length; ++i )
    this.templateIconIdComboBox.addItem( icons[ i ] );
  this.templateIconIdComboBox.onItemSelected = function( item )
  {
    if ( this.itemText( item ) == "<none>" )
      engine.cosmeticCorrectionTemplateId = "";
    else
      engine.cosmeticCorrectionTemplateId = this.itemText( item );
  };

  this.templateIconIdSizer = new HorizontalSizer;
  this.templateIconIdSizer.spacing = 4;
  this.templateIconIdSizer.add( this.templateIconIdLabel );
  this.templateIconIdSizer.add( this.templateIconIdComboBox, 100 );

  //

  this.add( this.applySizer );
  this.add( this.templateIconIdSizer );

  this.updateControls = function()
  {
    this.applyCheckBox.checked = engine.cosmeticCorrection;
    this.templateIconIdLabel.enabled = engine.cosmeticCorrection;
    this.templateIconIdComboBox.enabled = engine.cosmeticCorrection;
    if ( engine.cosmeticCorrectionTemplateId.isEmpty() )
      this.templateIconIdComboBox.currentItem = 0;
    else
      this.templateIconIdComboBox.currentItem =
      this.templateIconIdComboBox.findItem( engine.cosmeticCorrectionTemplateId );
  };
}

CosmeticCorrectionControl.prototype = new Control;

// ----------------------------------------------------------------------------

function DeBayerControl( parent )
{
  this.__base__ = ParametersControl;
  this.__base__( "DeBayer", parent );

  //

  this.bayerPatternLabel = new Label( this );
  this.bayerPatternLabel.text = "Bayer/mosaic pattern:";
  this.bayerPatternLabel.minWidth = this.dialog.labelWidth1;
  this.bayerPatternLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  this.bayerPatternComboBox = new ComboBox( this );
  this.bayerPatternComboBox.addItem( "Auto" );
  this.bayerPatternComboBox.addItem( "RGGB" );
  this.bayerPatternComboBox.addItem( "BGGR" );
  this.bayerPatternComboBox.addItem( "GBRG" );
  this.bayerPatternComboBox.addItem( "GRBG" );
  this.bayerPatternComboBox.addItem( "GRGB" );
  this.bayerPatternComboBox.addItem( "GBGR" );
  this.bayerPatternComboBox.addItem( "RGBG" );
  this.bayerPatternComboBox.addItem( "BGRG" );
  this.bayerPatternComboBox.onItemSelected = function( itemIndex )
  {
    engine.bayerPattern = itemIndex;
  };

  this.bayerPatternSizer = new HorizontalSizer;
  this.bayerPatternSizer.spacing = 4;
  this.bayerPatternSizer.add( this.bayerPatternLabel );
  this.bayerPatternSizer.add( this.bayerPatternComboBox, 100 );

  //

  this.debayerMethodLabel = new Label( this );
  this.debayerMethodLabel.text = "DeBayer method:";
  this.debayerMethodLabel.minWidth = this.dialog.labelWidth1;
  this.debayerMethodLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  this.debayerMethodComboBox = new ComboBox( this );
  this.debayerMethodComboBox.addItem( "SuperPixel" );
  this.debayerMethodComboBox.addItem( "Bilinear" );
  this.debayerMethodComboBox.addItem( "VNG" );
  this.debayerMethodComboBox.onItemSelected = function( itemIndex )
  {
    engine.debayerMethod = itemIndex;
  };

  this.debayerMethodSizer = new HorizontalSizer;
  this.debayerMethodSizer.spacing = 4;
  this.debayerMethodSizer.add( this.debayerMethodLabel );
  this.debayerMethodSizer.add( this.debayerMethodComboBox, 100 );

  //

  this.add( this.bayerPatternSizer );
  this.add( this.debayerMethodSizer );

  this.updateControls = function()
  {
    this.enabled = engine.cfaImages;
    this.bayerPatternComboBox.currentItem = engine.bayerPattern;
    this.debayerMethodComboBox.currentItem = engine.debayerMethod;
  };
}

DeBayerControl.prototype = new Control;

// ----------------------------------------------------------------------------

function SubframesWeightsEditControl( parent, expand )
{
  this.__base__ = ParametersControl;
  this.__base__( "Subframe Weighting", parent, expand );

  this.presetsLabel = new Label( this );
  this.presetsLabel.text = "Preset:";
  this.presetsLabel.minWidth = this.dialog.labelWidth1 / 1.8;
  this.presetsLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  this.presetsComboBox = new ComboBox( this );
  this.presetsComboBox.addItem( "" );
  this.presetsComboBox.addItem( "Nebula" );
  this.presetsComboBox.addItem( "Galaxy" );
  this.presetsComboBox.addItem( "Cluster" );
  this.presetsComboBox.currentItem = engine.subframeWeightingPreset;
  this.presetsComboBox.onItemSelected = ( item ) =>
  {
    engine.subframeWeightingPreset = item;
    // update sliders
    switch ( item )
    {
      case 1: // Nebula
        engine.FWHMWeight = 5;
        engine.eccentricityWeight = 10;
        engine.SNRWeight = 20;
        engine.pedestal = 65;
        break;
      case 2: // Galaxy
        engine.FWHMWeight = 20;
        engine.eccentricityWeight = 15;
        engine.SNRWeight = 25;
        engine.pedestal = 40;
        break;
      case 3: // Cluster
        engine.FWHMWeight = 35;
        engine.eccentricityWeight = 35;
        engine.SNRWeight = 20;
        engine.pedestal = 10;
        break;
    }
    this.updateControls();
  };

  this.presetsSizer = new HorizontalSizer;
  this.presetsSizer.spacing = 4;
  this.presetsSizer.add( this.presetsLabel );
  this.presetsSizer.add( this.presetsComboBox, 100 );

  //

  this.FWHMControl = new NumericControl( this );
  this.FWHMControl.label.text = "FWHM:";
  this.FWHMControl.label.minWidth = this.dialog.labelWidth1 / 1.8;
  this.FWHMControl.setRange( 0, 100 );
  this.FWHMControl.slider.setRange( 0, 100 );
  this.FWHMControl.slider.scaledMinWidth = 1;
  this.FWHMControl.setPrecision( 0 );
  this.FWHMControl.setValue( engine.FWHMWeight );
  this.FWHMControl.toolTip = "<p>Weight contribution of the FWHM.</p>";
  this.FWHMControl.onValueUpdated = ( value ) =>
  {
    engine.FWHMWeight = value;
    engine.subframeWeightingPreset = 0;
    this.updateControls();
  };

  this.presetsSizer1 = new HorizontalSizer;
  this.presetsSizer1.spacing = 4;
  this.presetsSizer1.add( this.FWHMControl );

  //

  this.eccentricityControl = new NumericControl( this );
  this.eccentricityControl.label.text = "Eccentricity:";
  this.eccentricityControl.label.minWidth = this.dialog.labelWidth1 / 1.8;
  this.eccentricityControl.setRange( 0, 100 );
  this.eccentricityControl.slider.setRange( 0, 100 );
  this.eccentricityControl.slider.scaledMinWidth = 1;
  this.eccentricityControl.setPrecision( 0 );
  this.eccentricityControl.setValue( engine.eccentricityWeight );
  this.eccentricityControl.toolTip = "<p>Weight contribution of the stars eccentricity.</p>";
  this.eccentricityControl.onValueUpdated = ( value ) =>
  {
    engine.eccentricityWeight = value;
    engine.subframeWeightingPreset = 0;
    this.updateControls();
  };

  this.presetsSizer2 = new HorizontalSizer;
  this.presetsSizer2.spacing = 4;
  this.presetsSizer2.add( this.eccentricityControl );

  //

  this.SNRControl = new NumericControl( this );
  this.SNRControl.label.text = "SNR:";
  this.SNRControl.label.minWidth = this.dialog.labelWidth1 / 1.8;
  this.SNRControl.setRange( 0, 100 );
  this.SNRControl.slider.setRange( 0, 100 );
  this.SNRControl.slider.scaledMinWidth = 1;
  this.SNRControl.setPrecision( 0 );
  this.SNRControl.setValue( engine.SNRWeight );

  this.SNRControl.toolTip = "<p>Weight contribution of the SNR.</p>";
  this.SNRControl.onValueUpdated = ( value ) =>
  {
    engine.SNRWeight = value;
    engine.subframeWeightingPreset = 0;
    this.updateControls();
  };

  this.presetsSizer3 = new HorizontalSizer;
  this.presetsSizer3.spacing = 4;
  this.presetsSizer3.add( this.SNRControl );
  //

  this.PedestalControl = new NumericControl( this );
  this.PedestalControl.label.text = "Pedestal:";
  this.PedestalControl.label.minWidth = this.dialog.labelWidth1 / 1.8;
  this.PedestalControl.setRange( 1, 100 );
  this.PedestalControl.slider.setRange( 1, 100 );
  this.PedestalControl.slider.scaledMinWidth = 1;
  this.PedestalControl.setPrecision( 0 );
  this.PedestalControl.setValue( engine.pedestal );
  this.PedestalControl.toolTip = "<p>Weight contribution of the SNR.</p>";
  this.PedestalControl.onValueUpdated = ( value ) =>
  {
    engine.pedestal = value;
    this.updateControls();
  };
  this.presetsSizer4 = new HorizontalSizer;
  this.presetsSizer4.spacing = 4;
  this.presetsSizer4.add( this.PedestalControl );

  //

  this.add( this.presetsSizer );
  this.add( this.presetsSizer1 );
  this.add( this.presetsSizer2 );
  this.add( this.presetsSizer3 );
  this.add( this.presetsSizer4 );

  //

  this.updateControls = function()
  {
    this.presetsComboBox.currentItem = engine.subframeWeightingPreset;
    this.FWHMControl.setValue( engine.FWHMWeight );
    this.eccentricityControl.setValue( engine.eccentricityWeight );
    this.SNRControl.setValue( engine.SNRWeight );
    this.PedestalControl.setValue( engine.pedestal );
  };
}

SubframesWeightsEditControl.prototype = new Control;

// ----------------------------------------------------------------------------

function ImageRegistrationControl( parent, expand )
{
  this.__base__ = ParametersControl;
  this.__base__( "Image Registration", parent, expand );

  this.pixelInterpolationLabel = new Label( this );
  this.pixelInterpolationLabel.text = "Pixel interpolation:";
  this.pixelInterpolationLabel.minWidth = this.dialog.labelWidth1;
  this.pixelInterpolationLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  this.pixelInterpolationComboBox = new ComboBox( this );
  this.pixelInterpolationComboBox.addItem( "Nearest Neighbor" );
  this.pixelInterpolationComboBox.addItem( "Bilinear" );
  this.pixelInterpolationComboBox.addItem( "Bicubic Spline" );
  this.pixelInterpolationComboBox.addItem( "Bicubic B-Spline" );
  this.pixelInterpolationComboBox.addItem( "Lanczos-3" );
  this.pixelInterpolationComboBox.addItem( "Lanczos-4" );
  this.pixelInterpolationComboBox.addItem( "Lanczos-5" );
  this.pixelInterpolationComboBox.addItem( "Mitchell-Netravali Filter" );
  this.pixelInterpolationComboBox.addItem( "Catmul-Rom Spline Filter" );
  this.pixelInterpolationComboBox.addItem( "Cubic B-Spline Filter" );
  this.pixelInterpolationComboBox.addItem( "Auto" );
  this.pixelInterpolationComboBox.currentItem = engine.pixelInterpolation;
  this.pixelInterpolationComboBox.onItemSelected = function( item )
  {
    engine.pixelInterpolation = item;
  };

  this.pixelInterpolationSizer = new HorizontalSizer;
  this.pixelInterpolationSizer.spacing = 4;
  this.pixelInterpolationSizer.add( this.pixelInterpolationLabel );
  this.pixelInterpolationSizer.add( this.pixelInterpolationComboBox, 100 );

  //

  this.clampingThresholdControl = new NumericControl( this );
  this.clampingThresholdControl.label.text = "Clamping threshold:";
  this.clampingThresholdControl.label.minWidth = this.dialog.labelWidth1;
  this.clampingThresholdControl.setRange( 0, 1 );
  this.clampingThresholdControl.slider.setRange( 0, 1000 );
  this.clampingThresholdControl.slider.scaledMinWidth = 200;
  this.clampingThresholdControl.setPrecision( 2 );
  this.clampingThresholdControl.setValue( engine.clampingThreshold );
  this.clampingThresholdControl.edit.setFixedWidth( this.dialog.numericEditWidth );
  this.clampingThresholdControl.toolTip = "<p>Clamping threshold for the bicubic spline and Lanczos interpolation algorithms.</p>";
  this.clampingThresholdControl.onValueUpdated = function( value )
  {
    engine.clampingThreshold = value;
  };

  //

  this.maxStarsLabel = new Label( this );
  this.maxStarsLabel.text = "Maximum stars:";
  this.maxStarsLabel.minWidth = this.dialog.labelWidth1;
  this.maxStarsLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  this.maxStarsSpinBox = new SpinBox( this );
  this.maxStarsSpinBox.minValue = 0; // <Auto>
  this.maxStarsSpinBox.maxValue = 262144;
  this.maxStarsSpinBox.minimumValueText = "<Auto>";
  this.maxStarsSpinBox.toolTip = "<p>Maximum number of stars allowed for image registration.</p>" +
    "<p>By default, the BatchPreprocessing script limits the StarAlignment process to the 500 brightest stars in each image. " +
    "This is normally sufficient to achieve an accurate alignment for similar images without differential distortions.</p>" +
    "<p>If your images suffer from field distortions and the data set includes significantly displaced or rotated frames, such " +
    "as frames affected by meridian flips for example, then you should enable the distortion correction option. In such case this " +
    "parameter will be ignored and the StarAlignment tool will select the required stars automatically.</p>";
  this.maxStarsSpinBox.onValueUpdated = function( value )
  {
    engine.maxStars = value;
  };

  this.maxStarsSizer = new HorizontalSizer;
  this.maxStarsSizer.spacing = 4;
  this.maxStarsSizer.add( this.maxStarsLabel );
  this.maxStarsSizer.add( this.maxStarsSpinBox );
  this.maxStarsSizer.addStretch();

  //

  this.distortionCorrectionCheckBox = new CheckBox( this );
  this.distortionCorrectionCheckBox.text = "Distortion correction";
  this.distortionCorrectionCheckBox.toolTip = "<p>Check this option to enable StarAlignment's arbitrary distortion correction " +
    "algorithms.</p>" +
    "<p>This feature is required to correct for nonlinear distorions such as barrel, pincushion and lateral chromatic aberration, " +
    "as well as correction of differential field curvature and optical distortions, which arise frequently with mosaics and " +
    "frames significantly displaced or rotated (e.g., frames subject to meridian flips).</p>" +
    "<p>Distortion correction requires the use of thin plate splines and a large number of PSF star fits, so it can be " +
    "significantly slower than normal registration with projective transformations. For difficult cases where you need more " +
    "control, check the <i>calibrate only</i> option and align your images manually after calibration.</p>";
  this.distortionCorrectionCheckBox.__parentControl__ = this;
  this.distortionCorrectionCheckBox.onCheck = function( checked )
  {
    engine.distortionCorrection = checked;
    this.__parentControl__.updateControls();
  };

  this.distortionCorrectionSizer = new HorizontalSizer;
  this.distortionCorrectionSizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.distortionCorrectionSizer.add( this.distortionCorrectionCheckBox );
  this.distortionCorrectionSizer.addStretch();

  //

  this.noiseReductionFilterRadiusLabel = new Label( this );
  this.noiseReductionFilterRadiusLabel.text = "Noise reduction:";
  this.noiseReductionFilterRadiusLabel.minWidth = this.dialog.labelWidth1;
  this.noiseReductionFilterRadiusLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

  this.noiseReductionFilterRadiusSpinBox = new SpinBox( this );
  this.noiseReductionFilterRadiusSpinBox.minValue = 0; // <Auto>
  this.noiseReductionFilterRadiusSpinBox.maxValue = 50;
  this.noiseReductionFilterRadiusSpinBox.minimumValueText = "<Disabled>";
  this.noiseReductionFilterRadiusSpinBox.toolTip =
    "<p>Size of the noise reduction filter.</p>" +
    "<p>This is the radius in pixels of a Gaussian convolution filter applied to the working image used for " +
    "calculation of star positions during the star detection phase. Use it only for very low SNR images, where " +
    "the star detector cannot find reliable stars with default parameters. Be aware that noise reduction will " +
    "modify star profiles and hence the way star positions are calculated. Under extreme low-SNR conditions, " +
    "however, this is probably better than working with the actual data anyway.</p>" +
    "<p>To disable noise reduction, set this parameter to zero.</p>";
  this.noiseReductionFilterRadiusSpinBox.onValueUpdated = function( value )
  {
    engine.noiseReductionFilterRadius = value;
  };

  this.noiseReductionFilterRadiusSizer = new HorizontalSizer;
  this.noiseReductionFilterRadiusSizer.spacing = 4;
  this.noiseReductionFilterRadiusSizer.add( this.noiseReductionFilterRadiusLabel );
  this.noiseReductionFilterRadiusSizer.add( this.noiseReductionFilterRadiusSpinBox );
  this.noiseReductionFilterRadiusSizer.addStretch();

  //

  this.useTriangleSimilarityCheckBox = new CheckBox( this );
  this.useTriangleSimilarityCheckBox.text = "Use triangle similarity";
  this.useTriangleSimilarityCheckBox.toolTip = "<p>If this option is checked, the image registration process will use " +
    "triangle similarity instead of polygonal descriptors for the star matching routine.</p>" +
    "<p>Polygonal descriptors are more robust and accurate, but cannot register images subject to specular transformations " +
    "(horizontal and vertical mirror). Triangle similarity works well under normal conditions and is able to register " +
    "mirrored images, so it is the default option in the BatchPreprocessing script. If you need more control on image " +
    "registration parameters, check the <i>calibrate only</i> option and align your images manually after calibration.</p>";
  this.useTriangleSimilarityCheckBox.onCheck = function( checked )
  {
    engine.useTriangleSimilarity = checked;
  };

  this.useTriangleSimilaritySizer = new HorizontalSizer;
  this.useTriangleSimilaritySizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.useTriangleSimilaritySizer.add( this.useTriangleSimilarityCheckBox );
  this.useTriangleSimilaritySizer.addStretch();

  //

  this.add( this.pixelInterpolationSizer );
  this.add( this.clampingThresholdControl );
  this.add( this.maxStarsSizer );
  this.add( this.distortionCorrectionSizer );
  this.add( this.noiseReductionFilterRadiusSizer );
  this.add( this.useTriangleSimilaritySizer );

  this.updateControls = function()
  {
    this.enabled = !engine.calibrateOnly;
    this.pixelInterpolationComboBox.currentItem = engine.pixelInterpolation;
    this.clampingThresholdControl.setValue( engine.clampingThreshold );
    this.maxStarsSpinBox.value = engine.maxStars;
    this.maxStarsSpinBox.enabled = !engine.distortionCorrection;
    this.distortionCorrectionCheckBox.checked = engine.distortionCorrection;
    this.noiseReductionFilterRadiusSpinBox.value = engine.noiseReductionFilterRadius;
    this.useTriangleSimilarityCheckBox.checked = engine.useTriangleSimilarity;
  };
}


ImageRegistrationControl.prototype = new Control;

// ----------------------------------------------------------------------------

function LightsIntegrationControl( parent )
{
  this.__base__ = ParametersControl;
  this.__base__( "Image Integration", parent );

  //

  this.applyCheckBox = new CheckBox( this );
  this.applyCheckBox.text = "Apply";
  this.applyCheckBox.toolTip = "<p>Integrate light frames after image registration.</p>";
  this.applyCheckBox.onCheck = function( checked )
  {
    engine.integrate = checked;
    var lightsPage = this.dialog.tabBox.pageControlByIndex( ImageType.LIGHT );
    lightsPage.lightsIntegrationControl.updateControls();
  };

  this.applySizer = new HorizontalSizer;
  this.applySizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.applySizer.add( this.applyCheckBox );
  this.applySizer.addStretch();

  //

  this.editButton = new PushButton( this );
  this.editButton.text = "Integration parameters...";
  this.editButton.icon = this.scaledResource( ":/icons/arrow-right.png" );
  this.editButton.toolTip = "<p>Edit image integration parameters.</p>";
  this.editButton.onClick = function()
  {
    var lightsPage = this.dialog.tabBox.pageControlByIndex( ImageType.LIGHT );
    lightsPage.imageIntegrationControl.show();
  };

  this.editSizer = new HorizontalSizer;
  this.editSizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.editSizer.add( this.editButton, 100 );

  //

  this.add( this.applySizer );
  this.add( this.editSizer );

  this.updateControls = function()
  {
    this.enabled = !engine.calibrateOnly;
    this.applyCheckBox.checked = engine.integrate;
    this.editButton.enabled = engine.integrate;
  };
}

LightsIntegrationControl.prototype = new Control;

// ----------------------------------------------------------------------------

function SubframesWeightingControl( parent )
{
  this.__base__ = ParametersControl;
  this.__base__( "Subframe Weighting", parent );

  //

  this.subframesWeightCheckBox = new CheckBox( this );
  this.subframesWeightCheckBox.text = "Generate subrames weights";
  this.subframesWeightCheckBox.checked = engine.generateSubframesWeights;
  this.subframesWeightCheckBox.toolTip = "<p>Analyze subs quality and embed the correspondent weight to each sub. " +
    "These weights are assigned to the SWWeight key which can later be used with the ImageIntegration and DrizzleIntegration tools to " +
    "perform a drizzle integration process.</p>";
  this.subframesWeightCheckBox.onCheck = function( checked )
  {
    engine.generateSubframesWeights = checked;
    if ( !checked )
    {
      engine.useBestLightAsReference = false;
      engine.generateSubframesWeightsAfterRegistration = false;
    }
    this.dialog.updateControls();

  };

  this.subframesWeightDataSizer = new HorizontalSizer;
  this.subframesWeightDataSizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.subframesWeightDataSizer.add( this.subframesWeightCheckBox );
  this.subframesWeightDataSizer.addStretch();

  //

  this.subframesWeightAfterRegistrationCheckBox = new CheckBox( this );
  this.subframesWeightAfterRegistrationCheckBox.text = "Compute weights after registration";
  this.subframesWeightAfterRegistrationCheckBox.checked = engine.generateSubframesWeightsAfterRegistration;
  this.subframesWeightAfterRegistrationCheckBox.toolTip = "<p>Check this option if you prefer to " +
    "compute weights on registered images instead of computing weights on calibrated images.</p>";
  this.subframesWeightAfterRegistrationCheckBox.onCheck = function( checked )
  {
    engine.generateSubframesWeightsAfterRegistration = checked;
  };

  this.subframesWeightAfterRegistrationDataSizer = new HorizontalSizer;
  this.subframesWeightAfterRegistrationDataSizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.subframesWeightAfterRegistrationDataSizer.add( this.subframesWeightAfterRegistrationCheckBox );
  this.subframesWeightAfterRegistrationDataSizer.addStretch();

  //

  this.editButton = new PushButton( this );
  this.editButton.text = "Weighting parameters...";
  this.editButton.icon = this.scaledResource( ":/icons/arrow-right.png" );
  this.editButton.toolTip = "<p>Edit weighting parameters.</p>";
  this.editButton.onClick = function()
  {
    var lightsPage = this.dialog.tabBox.pageControlByIndex( ImageType.LIGHT );
    lightsPage.subframesWeightsEditControl.show();
  };

  this.editSizer = new HorizontalSizer;
  this.editSizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.editSizer.add( this.editButton, 100 );

  //

  this.subframesWeightUseBestReferenceCheckBox = new CheckBox( this );
  this.subframesWeightUseBestReferenceCheckBox.text = "Use best frame as reference for registration";
  this.subframesWeightUseBestReferenceCheckBox.checked = engine.useBestLightAsReference;
  this.subframesWeightUseBestReferenceCheckBox.toolTip = "<p>Check this flag to automatically select the best frame for registration. " +
    "The best frame will be the one with the highest weight given by the combination of 50% FWHM and 50% eccentrity only.</p > ";
  this.subframesWeightUseBestReferenceCheckBox.onCheck = function( checked )
  {
    engine.useBestLightAsReference = checked;
    this.dialog.updateControls();
  };

  this.subframesBestReferenceDataSizer = new HorizontalSizer;
  this.subframesBestReferenceDataSizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.subframesBestReferenceDataSizer.add( this.subframesWeightUseBestReferenceCheckBox );
  this.subframesBestReferenceDataSizer.addStretch();

  //

  this.add( this.subframesWeightDataSizer );
  this.add( this.subframesWeightAfterRegistrationDataSizer );
  this.add( this.editSizer );
  this.add( this.subframesBestReferenceDataSizer );

  this.updateControls = function()
  {
    this.subframesWeightCheckBox.checked = engine.generateSubframesWeights;
    this.subframesWeightUseBestReferenceCheckBox.checked = engine.useBestLightAsReference;
    this.subframesWeightAfterRegistrationCheckBox.checked = engine.generateSubframesWeightsAfterRegistration;
    this.enabled = !engine.calibrateOnly;
  };
}

SubframesWeightingControl.prototype = new Control;

// ----------------------------------------------------------------------------

function LightsRegistrationControl( parent )
{
  this.__base__ = ParametersControl;
  this.__base__( "Image Registration", parent );

  //

  this.generateDrizzleDataCheckBox = new CheckBox( this );
  this.generateDrizzleDataCheckBox.text = "Generate drizzle data";
  this.generateDrizzleDataCheckBox.toolTip = "<p>Generate .xdrz files in the image registration task. " +
    "These files can later be used with the ImageIntegration and DrizzleIntegration tools to " +
    "perform a drizzle integration process.</p>";
  this.generateDrizzleDataCheckBox.onCheck = function( checked )
  {
    engine.generateDrizzleData = checked;
    var lightsPage = this.dialog.tabBox.pageControlByIndex( ImageType.LIGHT );
    lightsPage.deBayeringControl.updateControls();
  };

  this.generateDrizzleDataSizer = new HorizontalSizer;
  this.generateDrizzleDataSizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.generateDrizzleDataSizer.add( this.generateDrizzleDataCheckBox );
  this.generateDrizzleDataSizer.addStretch();

  //

  this.editButton = new PushButton( this );
  this.editButton.text = "Registration parameters...";
  this.editButton.icon = this.scaledResource( ":/icons/arrow-right.png" );
  this.editButton.toolTip = "<p>Edit image registration parameters.</p>";
  this.editButton.onClick = function()
  {
    var lightsPage = this.dialog.tabBox.pageControlByIndex( ImageType.LIGHT );
    lightsPage.imageRegistrationControl.show();
  };

  this.editSizer = new HorizontalSizer;
  this.editSizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.editSizer.add( this.editButton, 100 );

  //

  this.add( this.generateDrizzleDataSizer );
  this.add( this.editSizer );

  this.updateControls = function()
  {
    this.generateDrizzleDataCheckBox.checked = engine.generateDrizzleData;
    this.enabled = !engine.calibrateOnly;
  };
}

LightsRegistrationControl.prototype = new Control;

// ----------------------------------------------------------------------------

function FileControl( parent, imageType )
{
  this.__base__ = Control;
  if ( parent )
    this.__base__( parent );
  else
    this.__base__();

  this.treeBox = new StyledTreeBox( this );
  this.treeBox.multipleSelection = true;
  this.treeBox.numberOfColumns = 1;
  this.treeBox.headerVisible = false;
  this.treeBox.setScaledMinWidth( 250 );

  //

  this.clearButton = new PushButton( this );
  this.clearButton.text = "Clear";
  this.clearButton.icon = this.scaledResource( ":/icons/clear.png" );
  this.clearButton.toolTip = "<p>Clear the current list of input files.</p>";
  this.clearButton.onClick = function()
  {
    this.dialog.clearTab( this.dialog.tabBox.currentPageIndex );
  };

  this.removeSelectedButton = new PushButton( this );
  this.removeSelectedButton.text = "Remove Selected";
  this.removeSelectedButton.icon = this.scaledResource( ":/icons/clear.png" );
  this.removeSelectedButton.toolTip = "<p>Remove selected items in the current list of input files.</p>";
  this.removeSelectedButton.onClick = function()
  {
    var tree = this.dialog.tabBox.pageControlByIndex( this.dialog.tabBox.currentPageIndex ).treeBox;
    var selected = tree.selectedNodes;
    for ( var step = 0; step < 2; ++step )
      for ( var i = 0; i < selected.length; ++i )
      {
        var node = selected[ i ];
        if ( step == 0 )
        {
          if ( node.nodeData_type == "FileItem" )
            engine.frameGroups[ node.parent.nodeData_index ].fileItems[ node.nodeData_index ] = null;
        }
        else
        {
          if ( node.nodeData_type == "FrameGroup" )
            engine.frameGroups[ node.nodeData_index ] = null;
        }
      }
    engine.purgeRemovedElements();
    this.dialog.refreshTreeBoxes();
  };

  this.invertSelectionButton = new PushButton( this );
  this.invertSelectionButton.text = "Invert Selection";
  this.invertSelectionButton.icon = this.scaledResource( ":/icons/select-invert.png" );
  this.invertSelectionButton.toolTip = "<p>Invert selected items in the current list of input files.</p>";
  this.invertSelectionButton.onClick = function()
  {
    function invertNodeSelection( node )
    {
      node.selected = !node.selected;
      for ( var i = 0; i < node.numberOfChildren; ++i )
        invertNodeSelection( node.child( i ) );
    }

    var tree = this.dialog.tabBox.pageControlByIndex( this.dialog.tabBox.currentPageIndex ).treeBox;
    for ( var i = 0; i < tree.numberOfChildren; ++i )
      invertNodeSelection( tree.child( i ) );
  };

  this.buttonsSizer = new HorizontalSizer;
  this.buttonsSizer.spacing = 6;
  this.buttonsSizer.add( this.clearButton );
  this.buttonsSizer.add( this.removeSelectedButton );
  this.buttonsSizer.addStretch();
  this.buttonsSizer.add( this.invertSelectionButton );

  //

  this.rightPanelSizer = new VerticalSizer;
  this.rightPanelSizer.add( this.buttonsSizer );
  this.rightPanelSizer.addSpacing( 8 );
  this.rightPanelSizer.addStretch();

  switch ( imageType )
  {
    case ImageType.BIAS:

      this.biasOverscanControl = new BiasOverscanControl( this );
      this.overscanControl = new OverscanControl( this, true /*expand*/ );

      this.rightPanelSizer.add( this.biasOverscanControl );
      this.rightPanelSizer.addSpacing( 8 );
      this.rightPanelSizer.add( this.overscanControl );

      this.imageIntegrationControl = new ImageIntegrationControl( this, ImageType.BIAS );
      this.rightPanelSizer.add( this.imageIntegrationControl );

      this.restyle();
      break;

    case ImageType.DARK:

      this.darkOptimizationThresholdControl = new NumericControl( this );
      this.darkOptimizationThresholdControl.label.text = "Optimization threshold:";
      this.darkOptimizationThresholdControl.label.minWidth = this.dialog.labelWidth1 +
        this.dialog.logicalPixelsToPhysical( 6 ); // + integration control margin
      this.darkOptimizationThresholdControl.setRange( 0, 10 );
      this.darkOptimizationThresholdControl.slider.setRange( 0, 200 );
      //this.darkOptimizationThresholdControl.slider.scaledMinWidth = 200;
      this.darkOptimizationThresholdControl.setPrecision( 4 );
      this.darkOptimizationThresholdControl.toolTip = "<p>Lower bound for the set of dark optimization pixels, " +
        "measured in sigma units from the median.</p>" +
        "<p>This parameter defines the set of dark frame pixels that will be used to compute dark optimization " +
        "factors adaptively. By restricting this set to relatively bright pixels, the optimization process can " +
        "be more robust to readout noise present in the master bias and dark frames. Increase this parameter to " +
        "remove more dark pixels from the optimization set.</p>";
      this.darkOptimizationThresholdControl.onValueUpdated = function( value )
      {
        engine.darkOptimizationLow = value;
      };

      this.rightPanelSizer.add( this.darkOptimizationThresholdControl );
      this.rightPanelSizer.addSpacing( 4 );

      //

      this.darkOptimizationWindowLabel = new Label( this );
      this.darkOptimizationWindowLabel.text = "Optimization window:";
      this.darkOptimizationWindowLabel.minWidth = this.dialog.labelWidth1 +
        this.dialog.logicalPixelsToPhysical( 6 ); // + integration control margin
      this.darkOptimizationWindowLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

      this.darkOptimizationWindowSpinBox = new SpinBox( this );
      this.darkOptimizationWindowSpinBox.minValue = 0;
      this.darkOptimizationWindowSpinBox.maxValue = 65536;
      this.darkOptimizationWindowSpinBox.setFixedWidth( this.dialog.numericEditWidth + this.logicalPixelsToPhysical( 16 ) );
      this.darkOptimizationWindowSpinBox.toolTip = "<p>This parameter is the size in pixels of a square region " +
        "used to compute noise estimates during the dark optimization procedure. The square region is centered " +
        "on each target image. By default, a <i>window</i> of one megapixel (1024x1024 pixels) is used.</p>" +
        "<p>By using a reduced subset of pixels, the dark optimization process can be much faster, and noise " +
        "evaluation on a reduced region is in general as accurate as noise evaluation on the whole image, for " +
        "dark frame scaling purposes.</p>" +
        "<p>To disable this feature, and hence to use the whole image to compute noise estimates, select a " +
        "zero window size. If the selected window size is larger than the dimensions of the target image, then " +
        "it will be ignored and the whole image will be used for noise evaluation.</p>";
      this.darkOptimizationWindowSpinBox.onValueUpdated = function( value )
      {
        engine.darkOptimizationWindow = value;
      };

      this.darkOptimizationWindowSizer = new HorizontalSizer;
      this.darkOptimizationWindowSizer.spacing = 4;
      this.darkOptimizationWindowSizer.add( this.darkOptimizationWindowLabel );
      this.darkOptimizationWindowSizer.add( this.darkOptimizationWindowSpinBox );
      this.darkOptimizationWindowSizer.addStretch();

      this.rightPanelSizer.add( this.darkOptimizationWindowSizer );
      this.rightPanelSizer.addSpacing( 4 );

      //

      this.darkExposureToleranceLabel = new Label( this );
      this.darkExposureToleranceLabel.text = "Exposure tolerance:";
      this.darkExposureToleranceLabel.minWidth = this.dialog.labelWidth1 +
        this.dialog.logicalPixelsToPhysical( 6 ); // + integration control margin
      this.darkExposureToleranceLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;

      this.darkExposureToleranceSpinBox = new SpinBox( this );
      this.darkExposureToleranceSpinBox.minValue = 0;
      this.darkExposureToleranceSpinBox.maxValue = 600;
      this.darkExposureToleranceSpinBox.setFixedWidth( this.dialog.numericEditWidth + this.logicalPixelsToPhysical( 16 ) );
      this.darkExposureToleranceSpinBox.toolTip = "<p>Dark frames with exposure times differing less than this value " +
        "(in seconds) will be grouped together.</p>";
      this.darkExposureToleranceSpinBox.onValueUpdated = function( value )
      {
        engine.darkExposureTolerance = value;
        engine.reconstructGroups();
        parent.dialog.refreshTreeBoxes();
      };

      this.darkExposureToleranceSizer = new HorizontalSizer;
      this.darkExposureToleranceSizer.spacing = 4;
      this.darkExposureToleranceSizer.add( this.darkExposureToleranceLabel );
      this.darkExposureToleranceSizer.add( this.darkExposureToleranceSpinBox );
      this.darkExposureToleranceSizer.addStretch();

      this.rightPanelSizer.add( this.darkExposureToleranceSizer );
      this.rightPanelSizer.addSpacing( 8 );

      //

      this.imageIntegrationControl = new ImageIntegrationControl( this, ImageType.DARK );
      this.rightPanelSizer.add( this.imageIntegrationControl );

      this.restyle();
      break;

    case ImageType.FLAT:
      //

      this.flatDarksOnlyCheckBox = new CheckBox( this );
      this.flatDarksOnlyCheckBox.checked = engine.flatDarksOnly;
      this.flatDarksOnlyCheckBox.text = "Calibrate with flat darks only";
      this.flatDarksOnlyCheckBox.toolTip = "<p>Perform calibration of flat frames only if darks with the same " +
        "duration (flat darks) are provided. Useful when scaling darks of significantly different duration is " +
        "not reliable because of the presence of non-negligible residuals, such as ampglow.</p>";
      this.flatDarksOnlyCheckBox.onCheck = function( checked )
      {
        engine.flatDarksOnly = checked;
      };

      this.flatDarksOnlySizer = new HorizontalSizer;
      this.flatDarksOnlySizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 6 + 4 ) );
      this.flatDarksOnlySizer.add( this.flatDarksOnlyCheckBox );
      this.flatDarksOnlySizer.addStretch();

      //

      this.rightPanelSizer.add( this.flatDarksOnlySizer );
      this.rightPanelSizer.addSpacing( 8 );
      this.imageIntegrationControl = new ImageIntegrationControl( this, ImageType.FLAT );
      this.rightPanelSizer.add( this.imageIntegrationControl );

      this.restyle();
      break;

    case ImageType.LIGHT:

      this.calibrateOnlyCheckBox = new CheckBox( this );
      this.calibrateOnlyCheckBox.text = "Calibrate only";
      this.calibrateOnlyCheckBox.toolTip = "<p>Calibrate only - Do not perform the image registration and integration tasks.</p>";
      this.calibrateOnlyCheckBox.onCheck = function( checked )
      {
        engine.calibrateOnly = checked;
        var lightsPage = this.dialog.tabBox.pageControlByIndex( ImageType.LIGHT );
        lightsPage.lightsRegistrationControl.updateControls();
        lightsPage.subframesWeightingControl.updateControls();
        lightsPage.imageRegistrationControl.updateControls();
        lightsPage.lightsIntegrationControl.updateControls();
        lightsPage.imageIntegrationControl.updateControls();
      };

      this.calibrateOnlySizer = new HorizontalSizer;
      this.calibrateOnlySizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 + 6 ) ); // + spacing + integration control margin
      this.calibrateOnlySizer.add( this.calibrateOnlyCheckBox );
      this.calibrateOnlySizer.addStretch();

      this.groupLightsWithDifferentExposureCheckBox = new CheckBox( this );
      this.groupLightsWithDifferentExposureCheckBox.text = "Group lights with different exposures";
      this.groupLightsWithDifferentExposureCheckBox.toolTip = "<p>When this option is active light frames with same binning and filter will be grouped and integrated together even if they have different exposures.</p>";
      this.groupLightsWithDifferentExposureCheckBox.onCheck = function( checked )
      {
        engine.groupLightsOfDifferentExposure = checked;
        engine.reconstructGroups();
        parent.dialog.refreshTreeBoxes();
      };

      this.groupLightsWithDifferentExposureSizer = new HorizontalSizer;
      this.groupLightsWithDifferentExposureSizer.addUnscaledSpacing( this.dialog.labelWidth1 + this.logicalPixelsToPhysical( 4 + 6 ) ); // + spacing + integration control margin
      this.groupLightsWithDifferentExposureSizer.add( this.groupLightsWithDifferentExposureCheckBox );
      this.groupLightsWithDifferentExposureSizer.addStretch();

      this.cosmeticCorrectionControl = new CosmeticCorrectionControl( this );
      this.deBayeringControl = new DeBayerControl( this );
      this.lightsRegistrationControl = new LightsRegistrationControl( this );
      this.subframesWeightingControl = new SubframesWeightingControl( this );
      this.subframesWeightsEditControl = new SubframesWeightsEditControl( this, true /*expand*/ );
      this.imageRegistrationControl = new ImageRegistrationControl( this, true /*expand*/ );
      this.lightsIntegrationControl = new LightsIntegrationControl( this );
      this.imageIntegrationControl = new ImageIntegrationControl( this, ImageType.LIGHT, true /*expand*/ );

      this.rightPanelSizer.add( this.calibrateOnlySizer );
      this.rightPanelSizer.addSpacing( 8 );
      this.rightPanelSizer.add( this.groupLightsWithDifferentExposureSizer );
      this.rightPanelSizer.addSpacing( 8 );
      this.rightPanelSizer.add( this.cosmeticCorrectionControl );
      this.rightPanelSizer.addSpacing( 8 );
      this.rightPanelSizer.add( this.deBayeringControl );
      this.rightPanelSizer.addSpacing( 8 );
      this.rightPanelSizer.add( this.subframesWeightsEditControl );
      this.rightPanelSizer.add( this.subframesWeightingControl );
      this.rightPanelSizer.addSpacing( 8 );
      this.rightPanelSizer.add( this.lightsRegistrationControl );
      this.rightPanelSizer.add( this.imageRegistrationControl );
      this.rightPanelSizer.addSpacing( 8 );
      this.rightPanelSizer.add( this.lightsIntegrationControl );
      this.rightPanelSizer.add( this.imageIntegrationControl );

      this.restyle();
      this.lightsRegistrationControl.minWidth =
        this.dialog.tabBox.pageControlByIndex( ImageType.BIAS ).imageIntegrationControl.width;
      break;
  }

  //

  this.sizer = new HorizontalSizer;
  this.sizer.margin = 8;
  this.sizer.add( this.treeBox, 100 );
  this.sizer.addSpacing( 12 );
  this.sizer.add( this.rightPanelSizer );
}

FileControl.prototype = new Control;

// ----------------------------------------------------------------------------

function ResetDialog()
{
  this.__base__ = Dialog;
  this.__base__();

  //

  this.resetParametersRadioButton = new RadioButton( this );
  this.resetParametersRadioButton.text = "Reset all parameters to factory-default values";

  this.reloadSettingsRadioButton = new RadioButton( this );
  this.reloadSettingsRadioButton.text = "Reload settings stored since the last session";
  this.reloadSettingsRadioButton.checked = true;

  this.clearFileListsCheckBox = new CheckBox( this );
  this.clearFileListsCheckBox.text = "Clear all file lists";
  this.clearFileListsCheckBox.checked = false;

  //

  this.okButton = new PushButton( this );
  this.okButton.defaultButton = true;
  this.okButton.text = "OK";
  this.okButton.icon = this.scaledResource( ":/icons/ok.png" );
  this.okButton.onClick = function()
  {
    this.dialog.ok();
  };

  this.cancelButton = new PushButton( this );
  this.cancelButton.text = "Cancel";
  this.cancelButton.icon = this.scaledResource( ":/icons/cancel.png" );
  this.cancelButton.onClick = function()
  {
    this.dialog.cancel();
  };

  this.buttonsSizer = new HorizontalSizer;
  this.buttonsSizer.addStretch();
  this.buttonsSizer.add( this.okButton );
  this.buttonsSizer.addSpacing( 8 );
  this.buttonsSizer.add( this.cancelButton );

  //

  this.sizer = new VerticalSizer;
  this.sizer.margin = 8;
  this.sizer.spacing = 6;
  this.sizer.add( this.resetParametersRadioButton );
  this.sizer.add( this.reloadSettingsRadioButton );
  this.sizer.add( this.clearFileListsCheckBox );
  this.sizer.add( this.buttonsSizer );

  this.adjustToContents();
  this.setFixedSize();

  this.windowTitle = "Reset Preprocessing Engine";
}

ResetDialog.prototype = new Dialog;

// ----------------------------------------------------------------------------

function SelectCustomFilesDialog()
{
  this.__base__ = Dialog;
  this.__base__();

  this.imageType = ImageType.UNKNOWN;
  this.filter = "?"; // ### see StackEngine.addFile()
  this.binning = 0;
  this.exposureTime = 0;
  this.files = new Array;

  var labelWidth1 = this.font.width( "Exposure time (s):" + "M" );

  //

  this.fileListLabel = new Label( this );
  this.fileListLabel.text = "Selected Files";

  this.fileList = new StyledTreeBox( this );
  this.fileList.numberOfColumns = 1;
  this.fileList.headerVisible = false;
  this.fileList.setScaledMinSize( 400, 250 );

  this.addButton = new PushButton( this );
  this.addButton.text = "Add Files";
  this.addButton.icon = this.scaledResource( ":/icons/add.png" );
  this.addButton.toolTip = "<p>Add files to the input files list.</p>";
  this.addButton.onClick = function()
  {
    var ofd = new OpenFileDialog;
    ofd.multipleSelections = true;
    ofd.caption = "Select Images";
    ofd.loadImageFilters();
    if ( ofd.execute() )
    {
      for ( var i = 0; i < ofd.fileNames.length; ++i )
        this.dialog.files.push( ofd.fileNames[ i ] );
      this.dialog.updateFileList();
    }
  };

  this.clearButton = new PushButton( this );
  this.clearButton.text = "Clear";
  this.clearButton.icon = this.scaledResource( ":/icons/clear.png" );
  this.clearButton.toolTip = "<p>Clear the curent list of input files.</p>";
  this.clearButton.onClick = function()
  {
    this.dialog.files = new Array;
    this.dialog.updateFileList();
  };

  this.fileButtonsSizer = new HorizontalSizer;
  this.fileButtonsSizer.addUnscaledSpacing( labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.fileButtonsSizer.add( this.addButton );
  this.fileButtonsSizer.addSpacing( 8 );
  this.fileButtonsSizer.add( this.clearButton );
  this.fileButtonsSizer.addStretch();

  //

  var imageTypeToolTip = "<p>Frame type. Select '?' to determine frame types automatically.</p>";

  this.imageTypeLabel = new Label( this );
  this.imageTypeLabel.text = "Image type:";
  this.imageTypeLabel.minWidth = labelWidth1;
  this.imageTypeLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;
  this.imageTypeLabel.toolTip = imageTypeToolTip;

  this.imageTypeComboBox = new ComboBox( this );
  this.imageTypeComboBox.addItem( "?" );
  this.imageTypeComboBox.addItem( "Bias frame" );
  this.imageTypeComboBox.addItem( "Dark frame" );
  this.imageTypeComboBox.addItem( "Flat field" );
  this.imageTypeComboBox.addItem( "Light frame" );
  this.imageTypeComboBox.currentItem = this.imageType + 1; // ImageType property -> combobox item
  this.imageTypeComboBox.toolTip = imageTypeToolTip;
  this.imageTypeComboBox.onItemSelected = function( item )
  {
    this.dialog.imageType = item - 1; // combobox item -> ImageType property
  };

  this.imageTypeSizer = new HorizontalSizer;
  this.imageTypeSizer.spacing = 4;
  this.imageTypeSizer.add( this.imageTypeLabel );
  this.imageTypeSizer.add( this.imageTypeComboBox, 100 );

  //

  var filterToolTip = "<p>Filter name. Specify a single question mark '?' to determine filters automatically.</p>";

  this.filterLabel = new Label( this );
  this.filterLabel.text = "Filter name:";
  this.filterLabel.minWidth = labelWidth1;
  this.filterLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;
  this.filterLabel.toolTip = filterToolTip;

  this.filterEdit = new Edit( this );
  this.filterEdit.text = this.filter;
  this.filterEdit.toolTip = filterToolTip;
  this.filterEdit.onEditCompleted = function()
  {
    this.text = this.dialog.filter = this.text.trim();
  };

  this.filterSizer = new HorizontalSizer;
  this.filterSizer.spacing = 4;
  this.filterSizer.add( this.filterLabel );
  this.filterSizer.add( this.filterEdit, 100 );

  //

  var binningToolTip = "<p>Pixel binning. Specify zero to determine binnings automatically.</p>";

  this.binningLabel = new Label( this );
  this.binningLabel.text = "Binning:";
  this.binningLabel.minWidth = labelWidth1;
  this.binningLabel.textAlignment = TextAlign_Right | TextAlign_VertCenter;
  this.binningLabel.toolTip = binningToolTip;

  this.binningSpinBox = new SpinBox( this );
  this.binningSpinBox.minValue = 0;
  this.binningSpinBox.maxValue = 4;
  this.binningSpinBox.value = this.binning;
  this.binningSpinBox.toolTip = binningToolTip;
  this.binningSpinBox.onValueUpdated = function( value )
  {
    this.dialog.binning = value;
  };

  this.binningSizer = new HorizontalSizer;
  this.binningSizer.spacing = 4;
  this.binningSizer.add( this.binningLabel );
  this.binningSizer.add( this.binningSpinBox );
  this.binningSizer.addStretch();

  //

  this.exposureTimeEdit = new NumericEdit( this );
  this.exposureTimeEdit.label.text = "Exposure time (s):";
  this.exposureTimeEdit.label.minWidth = labelWidth1;
  this.exposureTimeEdit.setRange( 0, 999999 );
  this.exposureTimeEdit.setPrecision( 2 );
  this.exposureTimeEdit.setValue( this.exposureTime );
  this.exposureTimeEdit.toolTip = "<p>Exposure time in seconds. Specify zero to determine exposure times automatically.</p>";
  this.exposureTimeEdit.sizer.addStretch();
  this.exposureTimeEdit.onValueUpdated = function( value )
  {
    this.dialog.exposureTime = value;
  };

  //

  this.okButton = new PushButton( this );
  this.okButton.defaultButton = true;
  this.okButton.text = "OK";
  this.okButton.icon = this.scaledResource( ":/icons/ok.png" );
  this.okButton.onClick = function()
  {
    this.dialog.ok();
  };

  this.cancelButton = new PushButton( this );
  this.cancelButton.text = "Cancel";
  this.cancelButton.icon = this.scaledResource( ":/icons/cancel.png" );
  this.cancelButton.onClick = function()
  {
    this.dialog.cancel();
  };

  this.buttonsSizer = new HorizontalSizer;
  this.buttonsSizer.addUnscaledSpacing( labelWidth1 + this.logicalPixelsToPhysical( 4 ) );
  this.buttonsSizer.add( this.okButton );
  this.buttonsSizer.addSpacing( 8 );
  this.buttonsSizer.add( this.cancelButton );

  //

  this.sizer = new VerticalSizer;
  this.sizer.margin = 8;
  this.sizer.spacing = 6;
  this.sizer.add( this.fileListLabel );
  this.sizer.add( this.fileList, 100 );
  this.sizer.add( this.fileButtonsSizer );
  this.sizer.add( this.imageTypeSizer );
  this.sizer.add( this.filterSizer );
  this.sizer.add( this.binningSizer );
  this.sizer.add( this.exposureTimeEdit );
  this.sizer.add( this.buttonsSizer );

  this.adjustToContents();
  this.setMinSize();

  this.windowTitle = "Add Custom Frames";

  this.updateFileList = function()
  {
    this.fileList.clear();
    for ( var i = 0; i < this.files.length; ++i )
    {
      var node = new TreeBoxNode;
      node.setText( 0, File.extractNameAndExtension( this.files[ i ] ) );
      node.setToolTip( 0, this.files[ i ] );
      this.fileList.add( node );
    }
  };
}

SelectCustomFilesDialog.prototype = new Dialog;

// ----------------------------------------------------------------------------

function StackDialog()
{
  this.__base__ = Dialog;
  this.__base__();

  this.labelWidth1 = this.font.width( "Bayer/mosaic pattern:" + "M" );
  this.textEditWidth = 25 * this.font.width( "M" );
  this.numericEditWidth = 6 * this.font.width( "0" );
  this.suffixEditWidth = 10 * this.font.width( "M" );

  this.setScaledMinHeight( 500 );

  // Force an update of all dialog styling properties (fonts, colors, margins,
  // etc.). This is necessary in this case to ensure proper styling of complex
  // child controls.
  this.restyle();

  //

  this.helpLabel = new Label( this );
  this.helpLabel.margin = 4;
  this.helpLabel.wordWrapping = true;
  this.helpLabel.useRichText = true;
  this.helpLabel.text =
    "<p>A script for calibration and alignment of light frames<br/>" +
    "Copyright (c) 2012 Kai Wiechen.<br/>" +
    "Copyright (c) 2019 Roberto Sartori.<br/>" +
    "Copyright (c) 2019 Tommaso Rubechi.<br/>" +
    "Copyright (c) 2012-2019 Pleiades Astrophoto.<br/>";

  //

  this.helpButton = new ToolButton( this );
  this.helpButton.icon = this.scaledResource( ":/icons/comment.png" );
  this.helpButton.setScaledFixedSize( 20, 20 );
  this.helpButton.toolTip =
    "<p><b>1.</b> Select the Bias tab and load either raw bias frames or a master bias (check <i>Use master bias</i> if so).</p>" +
    "<p><b>2.</b> Select the Darks tab and repeat the process in step 1.</p>" +
    "<p><b>3.</b> Select the Flats tab and again repeat the process in step 1. Load flats for all the filters you will load in Lights.</p>" +
    "<p><b>4.</b> Select the Lights tab and load all the light frames you wish (you can load all filters in a single operation).</p>" +
    "<p><b>5.</b> Select a light frame as the <i>registration reference</i>. You can select it by simply double-clicking on the list or you can flag the option for the automatic selection.</p>" +
    "<p><b>6.</b> Select an output directory.</p>" +
    "<p><b>7.</b> Click Run and now go get a cup of coffee or a glass of wine.</p>" +
    "<p><b>8.</b> The script will output the calibrated and registered light frames on the output directory, in subfolders for each filter.</p>";

  //

  this.tabBox = new TabBox( this );

  this.tabBox.addPage( new FileControl( this, ImageType.BIAS ), "Bias" );
  this.tabBox.addPage( new FileControl( this, ImageType.DARK ), "Darks" );
  this.tabBox.addPage( new FileControl( this, ImageType.FLAT ), "Flats" );
  this.tabBox.addPage( new FileControl( this, ImageType.LIGHT ), "Lights" );
  this.tabBox.currentPageIndex = 3;

  // Handle click on file name -> set registration reference image
  this.tabBox.pageControlByIndex( ImageType.LIGHT ).treeBox.onNodeDoubleClicked = function( node, column )
  {
    // We create a nodeData_filePath property for each TreeBox node to store
    // the full path of the corresponding frame group element.
    // -- See refreshTreeBoxes()
    if ( !engine.useBestLightAsReference )
    {
      if ( node.nodeData_filePath )
        if ( !node.nodeData_filePath.isEmpty() )
        {
          engine.referenceImage = node.nodeData_filePath;
          this.dialog.referenceImageEdit.text = node.nodeData_filePath;
        }
    }
  };

  //

  this.newInstanceButton = new ToolButton( this );
  this.newInstanceButton.icon = this.scaledResource( ":/process-interface/new-instance.png" );
  this.newInstanceButton.setScaledFixedSize( 24, 24 );
  this.newInstanceButton.toolTip = "New Instance";
  this.newInstanceButton.onMousePress = function()
  {
    this.hasFocus = true;
    engine.exportParameters();
    this.pushed = false;
    this.dialog.newInstance();
  };

  //

  this.fileAddButton = new PushButton( this );
  this.fileAddButton.text = "Add Files";
  this.fileAddButton.icon = this.scaledResource( ":/icons/add.png" );
  this.fileAddButton.toolTip = "<p>Add files to the input files list.</p>" +
    "<p>Image types will be selected automatically based on XISF image properties and/or FITS keywords.</p>";
  this.fileAddButton.onClick = function()
  {
    var ofd = new OpenFileDialog;
    ofd.multipleSelections = true;
    ofd.caption = "Select Images";
    ofd.loadImageFilters();
    if ( ofd.execute() )
    {
      var n = 0;
      for ( var i = 0; i < ofd.fileNames.length; ++i )
        if ( engine.addFile( ofd.fileNames[ i ] ) )
          ++n;
      this.dialog.refreshTreeBoxes();

      if ( n < ofd.fileNames.length )
      {
        engine.diagnosticMessages.unshift( format( "=== %d of %d frames were added ===", n, ofd.fileNames.length ) );
        engine.showDiagnosticMessages();
        engine.clearDiagnosticMessages();
      }
    }
  };

  this.biasAddButton = new PushButton( this );
  this.biasAddButton.text = "Add Bias";
  this.biasAddButton.icon = this.scaledResource( ":/icons/add.png" );
  this.biasAddButton.toolTip = "<p>Add files to the input bias frames list.</p>" +
    "<p>Files will be added as bias frames unconditionally - no keyword checks will be performed.</p>";
  this.biasAddButton.onClick = function()
  {
    var ofd = new OpenFileDialog;
    ofd.multipleSelections = true;
    ofd.caption = "Select Bias Frames";
    ofd.loadImageFilters();
    if ( ofd.execute() )
    {
      var n = 0;
      for ( var i = 0; i < ofd.fileNames.length; ++i )
        if ( engine.addBiasFrame( ofd.fileNames[ i ] ) )
          ++n;
      this.dialog.refreshTreeBoxes();
      this.dialog.tabBox.currentPageIndex = ImageType.BIAS;

      if ( n < ofd.fileNames.length )
      {
        engine.diagnosticMessages.unshift( format( "=== %d of %d bias frames were added ===", n, ofd.fileNames.length ) );
        engine.showDiagnosticMessages();
        engine.clearDiagnosticMessages();
      }
    }
  };

  this.darkAddButton = new PushButton( this );
  this.darkAddButton.text = "Add Darks";
  this.darkAddButton.icon = this.scaledResource( ":/icons/add.png" );
  this.darkAddButton.toolTip = "<p>Add files to the input dark frames list.</p>" +
    "<p>Files will be added as dark frames unconditionally - no keyword checks will be performed.</p>";
  this.darkAddButton.onClick = function()
  {
    var ofd = new OpenFileDialog;
    ofd.multipleSelections = true;
    ofd.caption = "Select Dark Frames";
    ofd.loadImageFilters();
    if ( ofd.execute() )
    {
      var n = 0;
      for ( var i = 0; i < ofd.fileNames.length; ++i )
        if ( engine.addDarkFrame( ofd.fileNames[ i ] ) )
          ++n;
      this.dialog.refreshTreeBoxes();
      this.dialog.tabBox.currentPageIndex = ImageType.DARK;

      if ( n < ofd.fileNames.length )
      {
        engine.diagnosticMessages.unshift( format( "=== %d of %d dark frames were added ===", n, ofd.fileNames.length ) );
        engine.showDiagnosticMessages();
        engine.clearDiagnosticMessages();
      }
    }
  };

  this.flatAddButton = new PushButton( this );
  this.flatAddButton.text = "Add Flats";
  this.flatAddButton.icon = this.scaledResource( ":/icons/add.png" );
  this.flatAddButton.toolTip = "<p>Add files to the input flat frames list.</p>" +
    "<p>Files will be added as flat frames unconditionally - no keyword checks will be performed.</p>";
  this.flatAddButton.onClick = function()
  {
    var ofd = new OpenFileDialog;
    ofd.multipleSelections = true;
    ofd.caption = "Select Flat Frames";
    ofd.loadImageFilters();
    if ( ofd.execute() )
    {
      var n = 0;
      for ( var i = 0; i < ofd.fileNames.length; ++i )
        if ( engine.addFlatFrame( ofd.fileNames[ i ] ) )
          ++n;
      this.dialog.refreshTreeBoxes();
      this.dialog.tabBox.currentPageIndex = ImageType.FLAT;

      if ( n < ofd.fileNames.length )
      {
        engine.diagnosticMessages.unshift( format( "=== %d of %d flat frames were added ===", n, ofd.fileNames.length ) );
        engine.showDiagnosticMessages();
        engine.clearDiagnosticMessages();
      }
    }
  };

  this.lightAddButton = new PushButton( this );
  this.lightAddButton.text = "Add Lights";
  this.lightAddButton.icon = this.scaledResource( ":/icons/add.png" );
  this.lightAddButton.toolTip = "<p>Add files to the input light frames list.</p>" +
    "<p>Files will be added as light frames unconditionally - no keyword checks will be performed.</p>";
  this.lightAddButton.onClick = function()
  {
    var ofd = new OpenFileDialog;
    ofd.multipleSelections = true;
    ofd.caption = "Select Light Frames";
    ofd.loadImageFilters();
    if ( ofd.execute() )
    {
      var n = 0;
      for ( var i = 0; i < ofd.fileNames.length; ++i )
        if ( engine.addLightFrame( ofd.fileNames[ i ] ) )
          ++n;
      this.dialog.refreshTreeBoxes();
      this.dialog.tabBox.currentPageIndex = ImageType.LIGHT;

      if ( n < ofd.fileNames.length )
      {
        engine.diagnosticMessages.unshift( format( "=== %d of %d light frames were added ===", n, ofd.fileNames.length ) );
        engine.showDiagnosticMessages();
        engine.clearDiagnosticMessages();
      }
    }
  };

  this.customAddButton = new PushButton( this );
  this.customAddButton.text = "Add Custom";
  this.customAddButton.icon = this.scaledResource( ":/icons/document-edit.png" );
  this.customAddButton.toolTip = "<p>Add custom files to the input custom frames list.</p>";
  this.customAddButton.onClick = function()
  {
    var d = new SelectCustomFilesDialog;
    if ( d.execute() )
    {
      var n = 0;
      for ( var i = 0; i < d.files.length; ++i )
        if ( engine.addFile( d.files[ i ], d.imageType, d.filter, d.binning, d.exposureTime ) )
          ++n;
      this.dialog.refreshTreeBoxes();
      this.dialog.tabBox.currentPageIndex = d.imageType;

      if ( n < d.files.length )
      {
        engine.diagnosticMessages.unshift( format( "=== %d of %d custom frames were added ===", n, d.files.length ) );
        engine.showDiagnosticMessages();
        engine.clearDiagnosticMessages();
      }
    }
  };

  //

  this.resetButton = new PushButton( this );
  this.resetButton.text = "Reset";
  this.resetButton.icon = this.scaledResource( ":/icons/reload.png" );
  this.resetButton.toolTip = "<p>Perform optional reset and clearing actions.</p>";
  this.resetButton.onClick = function()
  {
    var d = new ResetDialog;
    if ( d.execute() )
    {
      if ( d.resetParametersRadioButton.checked )
        engine.setDefaultParameters();
      if ( d.reloadSettingsRadioButton.checked )
        engine.loadSettings();
      if ( d.clearFileListsCheckBox.checked )
        engine.frameGroups.length = 0;
      this.dialog.updateControls();
    }
  };

  //

  this.diagnosticsButton = new PushButton( this );
  this.diagnosticsButton.defaultButton = true;
  this.diagnosticsButton.text = "Diagnostics";
  this.diagnosticsButton.icon = this.scaledResource( ":/icons/gear.png" );
  this.diagnosticsButton.toolTip = "<p>Check validity of selected files and processes.</p>";
  this.diagnosticsButton.onClick = function()
  {
    engine.runDiagnostics();
    if ( engine.hasDiagnosticMessages() )
    {
      engine.showDiagnosticMessages();
      engine.clearDiagnosticMessages();
    }
    else
      ( new MessageBox( "Diagnostics completed OK.", TITLE + " v" + VERSION, StdIcon_Information, StdButton_Ok ) ).execute();
  };

  //

  this.runButton = new PushButton( this );
  this.runButton.text = "Run";
  this.runButton.icon = this.scaledResource( ":/icons/power.png" );
  this.runButton.onClick = function()
  {
    this.dialog.ok();
  };

  this.exitButton = new PushButton( this );
  this.exitButton.text = "Exit";
  this.exitButton.icon = this.scaledResource( ":/icons/close.png" );
  this.exitButton.onClick = function()
  {
    this.dialog.cancel();
  };

  //

  this.cfaImagesCheckBox = new CheckBox( this );
  this.cfaImagesCheckBox.text = "CFA images";
  this.cfaImagesCheckBox.toolTip = "<p>When checked, the Batch Preprocessing script works under the assumption that all " +
    "input frames (calibration and light frames) have been mosaiced with a Color Filter Array (CFA) pattern, such as a " +
    "Bayer pattern. When this option is enabled, an additional deBayering task will be performed prior to image " +
    "registration using the <i>Bayer pattern</i> and <i>DeBayer method</i> parameters.</p>";
  this.cfaImagesCheckBox.onCheck = function( checked )
  {
    engine.cfaImages = checked;
    this.dialog.updateControls();
  };

  //

  this.optimizeDarksCheckBox = new CheckBox( this );
  this.optimizeDarksCheckBox.text = "Optimize dark frames";
  this.optimizeDarksCheckBox.toolTip = "<p>Enable this option to apply <i>dark frame optimization</i> during calibration " +
    "of flat and light frames.</p>" +
    "<p>The dark frame optimization routine computes dark scaling factors to minimize the noise induced by dark subtraction.</p>";
  this.optimizeDarksCheckBox.onCheck = function( checked )
  {
    engine.optimizeDarks = checked;
    this.dialog.updateControls();
  };

  //

  this.generateRejectionMapsCheckBox = new CheckBox( this );
  this.generateRejectionMapsCheckBox.text = "Generate rejection maps"
  this.generateRejectionMapsCheckBox.toolTip = "<p>Generate rejection map images during integration of bias, dark, flat and " +
    "light frames.</p>" +
    "<p>Rejection maps are stored as multiple-image XISF files.</p>";
  this.generateRejectionMapsCheckBox.onCheck = function( checked )
  {
    engine.generateRejectionMaps = checked;
  };

  //

  this.saveProcessLogCheckBox = new CheckBox( this );
  this.saveProcessLogCheckBox.text = "Save process log";
  this.saveProcessLogCheckBox.toolTip = "<p>When checked, the log of the process will be saved as a plain text file on the " +
    "output directory tree.</p>";
  this.saveProcessLogCheckBox.onCheck = function( checked )
  {
    engine.saveProcessLog = checked;
  };

  //

  this.upBottomFITSCheckBox = new CheckBox( this );
  this.upBottomFITSCheckBox.text = "Up-bottom FITS";
  this.upBottomFITSCheckBox.toolTip = "<p>If this option is enabled, the Batch Preprocessing script assumes that all input " +
    "FITS files follow the \'top-left\' coordinate convention: the origin of coordinates is at the top left corner of the " +
    "image, and vertical coordinates grow from top to bottom. This is the convention used by most amateur camera control " +
    "applications.</p>" +
    "<p>If this option is disabled, the \'professional\' convention is assumed: the coordinate origin is at the " +
    "bottom left corner and vertical coordinates grow from bottom to top.</p>";
  this.upBottomFITSCheckBox.onCheck = function( checked )
  {
    engine.upBottomFITS = checked;
  };

  //

  this.useAsMasterBiasCheckBox = new CheckBox( this );
  this.useAsMasterBiasCheckBox.text = "Use master bias";
  this.useAsMasterBiasCheckBox.toolTip = "<p>Use the first bias frame file as master bias.</p>";
  this.useAsMasterBiasCheckBox.onCheck = function( checked )
  {
    engine.useAsMaster[ ImageType.BIAS ] = checked;
    engine.updateMasterFrames( ImageType.BIAS );
    this.dialog.updateControls();
  };

  //

  this.useAsMasterDarkCheckBox = new CheckBox( this );
  this.useAsMasterDarkCheckBox.text = "Use master dark";
  this.useAsMasterDarkCheckBox.toolTip = "<p>Use the first dark frame file as master dark.</p>";
  this.useAsMasterDarkCheckBox.onCheck = function( checked )
  {
    engine.useAsMaster[ ImageType.DARK ] = checked;
    engine.updateMasterFrames( ImageType.DARK );
    this.dialog.updateControls();
  };

  //

  this.useAsMasterFlatCheckBox = new CheckBox( this );
  this.useAsMasterFlatCheckBox.text = "Use master flat";
  this.useAsMasterFlatCheckBox.toolTip = "<p>Use the first flat frame file as master flat.</p>";
  this.useAsMasterFlatCheckBox.onCheck = function( checked )
  {
    engine.useAsMaster[ ImageType.FLAT ] = checked;
    engine.updateMasterFrames( ImageType.FLAT );
    this.dialog.updateControls();
  };

  //

  this.optionsSizer1 = new VerticalSizer;
  this.optionsSizer1.spacing = 4;
  this.optionsSizer1.add( this.cfaImagesCheckBox );
  this.optionsSizer1.add( this.optimizeDarksCheckBox );
  this.optionsSizer1.add( this.generateRejectionMapsCheckBox );
  //   this.optionsSizer1.add( this.exportCalibrationFilesCheckBox );
  this.optionsSizer1.add( this.saveProcessLogCheckBox );

  this.optionsSizer2 = new VerticalSizer;
  this.optionsSizer2.spacing = 4;
  this.optionsSizer2.add( this.upBottomFITSCheckBox );
  this.optionsSizer2.add( this.useAsMasterBiasCheckBox );
  this.optionsSizer2.add( this.useAsMasterDarkCheckBox );
  this.optionsSizer2.add( this.useAsMasterFlatCheckBox );
  this.optionsSizer2.addStretch();

  this.optionsSizer = new HorizontalSizer;
  this.optionsSizer.margin = 6;
  this.optionsSizer.spacing = 6;
  this.optionsSizer.add( this.optionsSizer1 );
  this.optionsSizer.add( this.optionsSizer2 );

  this.optionsControl = new ParametersControl( "Global Options", this );
  this.optionsControl.add( this.optionsSizer );

  //

  this.referenceImageEdit = new Edit( this );
  this.referenceImageEdit.minWidth = this.textEditWidth;
  this.referenceImageEdit.text = this.useBestLightAsReference ? 'auto' : engine.referenceImage;
  this.referenceImageEdit.toolTip = "<p>Reference image for image registration.</p>" +
    "<p>Along with selecting an existing disk file, you can double-click one of the light frames in " +
    "the Lights list to select it as the registration reference image.</p>";
  this.referenceImageEdit.onEditCompleted = function()
  {
    engine.referenceImage = this.text = File.windowsPathToUnix( this.text.trim() );
  };

  this.referenceImageSelectButton = new ToolButton( this );
  this.referenceImageSelectButton.icon = this.scaledResource( ":/icons/select-file.png" );
  this.referenceImageSelectButton.setScaledFixedSize( 20, 20 );
  this.referenceImageSelectButton.toolTip = "<p>Select the image registration reference image file.</p>";
  this.referenceImageSelectButton.onClick = function()
  {
    var ofd = new OpenFileDialog;
    ofd.multipleSelections = false;
    ofd.caption = "Select Registration Reference Image";
    ofd.loadImageFilters();
    var filters = ofd.filters;
    filters.push( [ "Comma Separated Value (CSV) files", ".csv", ".txt" ] );
    ofd.filters = filters;
    if ( ofd.execute() )
    {
      this.dialog.referenceImageEdit.text = engine.referenceImage = ofd.fileName;
    }
  };

  this.referenceImageSizer = new HorizontalSizer;
  this.referenceImageSizer.add( this.referenceImageEdit, 100 );
  this.referenceImageSizer.addSpacing( 2 );
  this.referenceImageSizer.add( this.referenceImageSelectButton );

  this.referenceImageControl = new ParametersControl( "Registration Reference Image", this );
  this.referenceImageControl.add( this.referenceImageSizer );

  //

  this.outputDirectoryEdit = new Edit( this );
  this.outputDirectoryEdit.minWidth = this.textEditWidth;
  this.outputDirectoryEdit.text = engine.outputDirectory;
  this.outputDirectoryEdit.toolTip = "<p>Output root directory.</p>" +
    "<p>The Batch Preprocessing script will generate all master, calibrated and registered images " +
    "populating a directory tree rooted at the specified output directory.</p>";
  this.outputDirectoryEdit.onEditCompleted = function()
  {
    var dir = File.windowsPathToUnix( this.text.trim() );
    if ( dir.endsWith( '/' ) )
      dir = dir.substring( 0, dir.length - 1 );
    engine.outputDirectory = this.text = dir;
  };

  this.outputDirSelectButton = new ToolButton( this );
  this.outputDirSelectButton.icon = this.scaledResource( ":/icons/select-file.png" );
  this.outputDirSelectButton.setScaledFixedSize( 20, 20 );
  this.outputDirSelectButton.toolTip = "<p>Select the output root directory.</p>";
  this.outputDirSelectButton.onClick = function()
  {
    var gdd = new GetDirectoryDialog;
    gdd.initialPath = engine.outputDirectory;
    gdd.caption = "Select Output Directory";
    if ( gdd.execute() )
    {
      var dir = gdd.directory;
      if ( dir.endsWith( '/' ) )
        dir = dir.substring( 0, dir.length - 1 );
      this.dialog.outputDirectoryEdit.text = engine.outputDirectory = dir;
    }
  };

  this.outputDirSizer = new HorizontalSizer;
  this.outputDirSizer.add( this.outputDirectoryEdit, 100 );
  this.outputDirSizer.addSpacing( 2 );
  this.outputDirSizer.add( this.outputDirSelectButton );

  this.outputDirControl = new ParametersControl( "Output Directory", this );
  this.outputDirControl.add( this.outputDirSizer );

  //

  this.buttonsSizer1 = new HorizontalSizer;
  this.buttonsSizer1.spacing = 6;
  this.buttonsSizer1.add( this.newInstanceButton );
  this.buttonsSizer1.add( this.fileAddButton );
  this.buttonsSizer1.add( this.biasAddButton );
  this.buttonsSizer1.add( this.darkAddButton );
  this.buttonsSizer1.add( this.flatAddButton );
  this.buttonsSizer1.add( this.lightAddButton );
  this.buttonsSizer1.add( this.customAddButton );
  this.buttonsSizer1.addSpacing( 24 );
  this.buttonsSizer1.add( this.resetButton );
  this.buttonsSizer1.addSpacing( 24 );
  this.buttonsSizer1.addStretch();

  //

  this.buttonsSizer2 = new HorizontalSizer;
  this.buttonsSizer2.spacing = 6;
  this.buttonsSizer2.add( this.diagnosticsButton );
  this.buttonsSizer2.addStretch();
  this.buttonsSizer2.add( this.runButton );
  this.buttonsSizer2.add( this.exitButton );

  //

  this.fileListsSizer = new VerticalSizer;
  this.fileListsSizer.spacing = 8;
  this.fileListsSizer.add( this.tabBox, 100 );
  this.fileListsSizer.add( this.buttonsSizer1 );

  //

  this.settingsSizer = new VerticalSizer;
  this.settingsSizer.spacing = 8;
  this.settingsSizer.addSpacing( 24 );
  this.settingsSizer.add( this.helpLabel );
  this.settingsSizer.add( this.helpButton );
  this.settingsSizer.addStretch();
  this.settingsSizer.add( this.optionsControl );
  this.settingsSizer.add( this.referenceImageControl );
  this.settingsSizer.add( this.outputDirControl );
  this.settingsSizer.add( this.buttonsSizer2 );

  //

  this.sizer = new HorizontalSizer;
  this.sizer.margin = 8;
  this.sizer.spacing = 8;
  this.sizer.add( this.fileListsSizer, 100 );
  this.sizer.add( this.settingsSizer );

  //

  this.windowTitle = TITLE + " v" + VERSION;
  this.adjustToContents();
  this.setMinSize( this.width, this.height + this.logicalPixelsToPhysical( 8 ) );
}

StackDialog.prototype = new Dialog;

StackDialog.prototype.clearTab = function( index )
{
  this.dialog.tabBox.pageControlByIndex( index ).treeBox.clear();
  engine.deleteFrameSet( index );
};

StackDialog.prototype.updateControls = function()
{
  this.refreshTreeBoxes();

  for ( var i = 0; i < 4; ++i )
  {
    var page = this.tabBox.pageControlByIndex( i );

    switch ( i )
    {
      case ImageType.BIAS:
        page.biasOverscanControl.updateControls();
        page.overscanControl.updateControls();
        break;
      case ImageType.DARK:
        page.darkOptimizationThresholdControl.setValue( engine.darkOptimizationLow );
        page.darkOptimizationThresholdControl.enabled = engine.optimizeDarks;
        page.darkOptimizationWindowSpinBox.value = engine.darkOptimizationWindow;
        page.darkOptimizationWindowLabel.enabled = engine.optimizeDarks;
        page.darkOptimizationWindowSpinBox.enabled = engine.optimizeDarks;
        page.darkExposureToleranceSpinBox.value = engine.darkExposureTolerance;
        break;
      case ImageType.FLAT:
        page.flatDarksOnlyCheckBox.checked = engine.flatDarksOnly;
        break;
      case ImageType.LIGHT:
        page.calibrateOnlyCheckBox.checked = engine.calibrateOnly;
        page.groupLightsWithDifferentExposureCheckBox.checked = engine.groupLightsOfDifferentExposure;
        page.cosmeticCorrectionControl.updateControls();
        page.deBayeringControl.updateControls();
        page.lightsRegistrationControl.updateControls();
        page.imageRegistrationControl.updateControls();
        page.lightsIntegrationControl.updateControls();
        page.imageIntegrationControl.updateControls();
        break;
    }

    page.imageIntegrationControl.updateControls();
  }

  this.cfaImagesCheckBox.checked = engine.cfaImages;
  this.optimizeDarksCheckBox.checked = engine.optimizeDarks;
  this.generateRejectionMapsCheckBox.checked = engine.generateRejectionMaps;
  //   this.exportCalibrationFilesCheckBox.checked = engine.exportCalibrationFiles;
  this.saveProcessLogCheckBox.checked = engine.saveProcessLog;
  this.upBottomFITSCheckBox.checked = engine.upBottomFITS;
  this.useAsMasterBiasCheckBox.checked = engine.useAsMaster[ ImageType.BIAS ];
  this.useAsMasterDarkCheckBox.checked = engine.useAsMaster[ ImageType.DARK ];
  this.useAsMasterFlatCheckBox.checked = engine.useAsMaster[ ImageType.FLAT ];
  this.referenceImageEdit.text = engine.useBestLightAsReference ? 'auto' : engine.referenceImage;
  this.outputDirectoryEdit.text = engine.outputDirectory;
  this.referenceImageEdit.enabled = !engine.useBestLightAsReference;
  this.referenceImageSelectButton.enabled = !engine.useBestLightAsReference;
};

StackDialog.prototype.refreshTreeBoxes = function()
{
  for ( var j = 0; j < this.tabBox.numberOfPages; ++j )
    this.tabBox.pageControlByIndex( j ).treeBox.clear();

  // map groups to hash-tree
  var tree = {};
  for ( var i = 0; i < engine.frameGroups.length; ++i )
  {
    var frameGroup = engine.frameGroups[ i ];
    let imageType = frameGroup.imageType;
    let binning = frameGroup.binning.toString();
    let filter = frameGroup.filter;
    let exposureTimes = frameGroup.exposureTimes;

    var node;
    var treeNode;

    if ( !tree.hasOwnProperty( imageType ) )
    {
      tree[ imageType ] = {};
      treeNode = tree[ imageType ];
    }
    else
    {
      treeNode = tree[ imageType ];
      node = treeNode.node;
    }

    if ( !treeNode.hasOwnProperty( binning ) )
    {
      node = new TreeBoxNode;
      this.tabBox.pageControlByIndex( imageType ).treeBox.add( node );
      node.expanded = true;
      node.setText( 0, "Binning " + binning );
      node.nodeData_type = "FrameGroup";
      node.nodeData_index = i;
      treeNode[ binning ] = {};
      treeNode[ binning ].node = node;
      treeNode = treeNode[ binning ];
    }
    else
    {
      treeNode = treeNode[ binning ];
      node = treeNode.node;
    }

    // BIASes and DARKs are not grouped by filter 
    if ( imageType !== ImageType.BIAS )
    {

      if ( imageType !== ImageType.DARK )
      {
        let filterName = filter.length > 0 ? filter : 'noFilter';
        if ( !treeNode.hasOwnProperty( filterName ) )
        {
          node = new TreeBoxNode( node );
          node.expanded = true;
          node.setText( 0, filterName );
          node.nodeData_type = "FrameGroup";
          node.nodeData_index = i;
          treeNode[ filterName ] = {};
          treeNode[ filterName ].node = node;
          treeNode = treeNode[ filterName ];
        }
        else
        {
          treeNode = treeNode[ filterName ];
          node = treeNode.node;

        }
      }

      let exposureTimesString = exposureTimes.length == 1 ? format( "%.2fs", exposureTimes[ 0 ] ) : "[" + exposureTimes.map( exp => format( "%.2fs", exp ) ).join( ' , ' ) + ']';
      if ( !treeNode.hasOwnProperty( exposureTimesString ) )
      {

        node = new TreeBoxNode( node );
        node.expanded = true;
        node.setText( 0, exposureTimesString );
        node.nodeData_type = "FrameGroup";
        node.nodeData_index = i;
        treeNode[ exposureTimesString ] = {};
        treeNode[ exposureTimesString ].node = node;
      }
      else
      {
        node = treeNode[ exposureTimesString ].node;
      }
    }

    let rootNode = node;

    for ( var j = 0; j < frameGroup.fileItems.length; ++j )
    {
      var fileItem = frameGroup.fileItems[ j ];

      var node = new TreeBoxNode( rootNode );

      node.setText( 0, File.extractNameAndExtension( fileItem.filePath ) );

      var toolTip = "<p style=\"white-space:pre;\">" + fileItem.filePath;
      if ( fileItem.exposureTime > 0.004999 )
        toolTip += format( "<br/>Exposure: %.2f s", fileItem.exposureTime );
      toolTip += "</p>";
      node.setToolTip( 0, toolTip );

      var icon = "";
      if ( j == 0 && frameGroup.masterFrame )
      {
        icon = ":/bullets/bullet-star-blue.png";
        var f = node.font( 0 );
        f.bold = true;
        node.setFont( 0, f );
      }
      else
        switch ( frameGroup.imageType )
        {
          case ImageType.BIAS:
          case ImageType.DARK:
          case ImageType.FLAT:
            icon = ":/bullets/bullet-ball-gray.png";
            break;
          case ImageType.LIGHT:
            icon = ":/bullets/bullet-ball-blue.png";
            break;
        }
      if ( !icon.isEmpty() )
        node.setIcon( 0, this.scaledResource( icon ) );

      node.nodeData_type = "FileItem";
      node.nodeData_index = j;
      node.nodeData_filePath = fileItem.filePath;
    }
  }
};


// ----------------------------------------------------------------------------
// EOF WeightedBatchPreprocessing-GUI.js - Released 2018-11-30T21:29:47Z
