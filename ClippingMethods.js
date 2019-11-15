function main()
{

  console.noteln( "No rejection: ", ImageIntegration.prototype.NoRejection );
  console.noteln( "Min/Max: ", ImageIntegration.prototype.MinMax );
  console.noteln( "Percentile Clipping: ", ImageIntegration.prototype.PercentileClip );
  console.noteln( "Sigma Clipping: ", ImageIntegration.prototype.SigmaClip );
  console.noteln( "Averaged Sigma Clipping: ", ImageIntegration.prototype.AveragedSigmaClip );
  console.noteln( "Winsorized Sigma Clipping: ", ImageIntegration.prototype.WinsorizedSigmaClip );
  console.noteln( "Linear Fit Clipping: ", ImageIntegration.prototype.LinearFit );
  console.noteln( "CCDClipping: ", ImageIntegration.prototype.CCDClip );
  console.noteln( "Generalized Extreme Studentized Deviate: ", ImageIntegration.prototype.Rejection_ESD );

}

main();
