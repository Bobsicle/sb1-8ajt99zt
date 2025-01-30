import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1609 1609"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="matrix(1,0,0,1,3.58173,-29.7197)">
        <g transform="matrix(25.9161,0,-1.65964e-14,25.9161,143.227,176.554)">
          <g>
            <clipPath id="_clip1">
              <rect x="0" y="0" width="51" height="51"/>
            </clipPath>
            <g clipPath="url(#_clip1)">
              <g transform="matrix(0.143656,0,0,0.143656,24.4074,45.5009)">
                <g>
                  <g>
                    <path d="M0,-280.661C-32.39,-280.137 -64.39,-266.943 -88.74,-244.116C-106.85,-227.801 -121.53,-206.684 -129.01,-182.532C-134.34,-166.451 -135.49,-149.162 -134.84,-132.238C-133.98,-102.471 -122.14,-73.593 -103.47,-51.663C-83.27,-27.329 -55.98,-9.528 -26.09,-2.877C-7,1.079 12.7,1.453 31.92,-1.551C60.45,-6.074 87.42,-20.711 108.05,-42.212C120.391,-54.508 130.78,-69.188 137.71,-85.685C147.71,-108.352 150.07,-134.183 147.29,-158.87C144.04,-188.84 129.45,-216.617 109.08,-237.188C96.7,-250.275 82.07,-260.902 66.101,-268.344C45.43,-278.277 22.51,-281.57 0,-280.661M-17.55,-315.227C27.66,-320.958 75.59,-310.534 112.68,-281.505C136.69,-263.03 157.05,-238.546 169.5,-209.71C187.63,-166.344 187.74,-114.842 169.74,-71.401C159.4,-46.853 143.09,-25.491 123.88,-8.234C104.76,8.98 82.28,22.12 58.061,28.931C19.48,40.297 -22.41,38.553 -59.98,23.777C-88.54,12.295 -113.8,-7.774 -133.49,-32.589C-143.52,-45.58 -152.21,-59.897 -158.15,-75.549C-175.74,-121.653 -173.65,-176.148 -151.41,-220.049C-132.53,-255.931 -102.21,-284.703 -66.98,-301.2C-51.24,-308.395 -34.48,-312.768 -17.55,-315.227" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
        <g transform="matrix(0.957785,0,0,0.957785,800.472,834.969)">
          <g transform="matrix(1,0,0,1,-627.5,-627.5)">
            <g transform="matrix(1,0,0,1,0.281987,0.128057)">
              <path d="M627.434,0.007C544.96,0.007 458.787,15.215 383.296,49.345C290.469,91.314 208.495,149.471 143.338,228.428C104.271,275.769 74.54,327.548 49.329,383.309C32.492,420.548 20.925,461.098 12.747,501.053C-25.035,685.645 23.225,880.891 143.338,1026.45C208.495,1105.4 290.469,1163.56 383.296,1205.53C458.787,1239.66 544.96,1254.87 627.434,1254.87C709.908,1254.87 796.081,1239.66 871.572,1205.53C964.399,1163.56 1046.37,1105.4 1111.53,1026.45C1231.64,880.891 1279.9,685.645 1242.12,501.053C1233.94,461.098 1222.38,420.548 1205.54,383.309C1180.33,327.548 1150.6,275.769 1111.53,228.428C1046.37,149.471 964.399,91.314 871.572,49.345C796.081,15.215 709.907,0.007 627.434,0.007ZM668.919,1175.73C633.185,1178.4 662.58,1157.15 674.903,1106.96C689.654,1046.88 703.159,986.493 718.25,926.497C723.11,907.175 728.305,887.935 733.675,868.748C734.039,867.448 735.068,866.21 736.574,866.625C737.658,866.924 738.911,868.2 738.615,869.483C731.864,898.733 724.329,927.797 717.551,957.041C704.775,1012.16 692.237,1067.34 679.954,1122.58C676.026,1140.24 671.47,1157.82 668.919,1175.73ZM917.076,1094.8C914.543,1091.01 911.588,1087.34 908.189,1083.8C891.52,1066.33 869.245,1058.32 845.364,1063.06C830.628,1066.12 816.136,1070.2 801.522,1073.8C799.44,1074.33 797.358,1074.69 794.908,1075.18C794.908,1073.39 794.786,1072.29 794.908,1071.18C797.154,1053.55 799.358,1035.91 801.685,1018.28C804.216,999.052 806.828,979.865 809.441,960.638C811.972,941.534 814.544,922.47 817.156,903.365C819.973,882.832 822.871,862.298 825.729,841.724C828.097,824.865 831.077,808.087 836.955,792.003C840.751,781.757 843.242,771.265 843.854,760.284C844.505,748.31 843.233,736.108 838.899,724.835C827,693.885 795.715,676.352 764.659,670.394C752.617,668.108 742.003,663.414 734.614,653.086C733.716,651.78 733.104,650.228 732.369,648.8C732.573,648.514 732.818,648.228 733.022,647.942C734.492,648.31 736.206,648.31 737.431,649.085C741.636,651.861 745.963,654.515 749.719,657.821C757.872,664.973 766.426,666.098 775.763,660.801C804.42,644.595 831.852,626.552 858.06,606.631C885.901,585.403 910.761,560.951 935.948,536.825C937.05,535.723 938.234,534.661 939.132,533.804C946.603,538.417 953.543,543.152 960.89,547.194C990.527,563.441 1022.65,570.421 1056.09,571.973C1062.78,572.292 1070.42,572.706 1076.66,569.714C1084.81,565.808 1089.8,556.042 1086.84,547.18C1085.77,543.986 1083.64,541.172 1081.39,538.666C1068.09,523.852 1046.28,520.016 1029.27,511.821C1027.81,511.118 1031.12,508.468 1032.74,508.413C1037.55,508.313 1042.17,510.472 1046.69,512.151C1061.05,517.499 1075.25,524.725 1086.91,534.825C1094.04,541.005 1096.41,546.374 1104.99,550.419C1120.64,557.793 1128.26,533.431 1124.91,522.619C1123.24,517.149 1119.28,512.291 1115.16,508.576C1101.06,495.983 1073.27,488.184 1059.03,481.103C1055.54,479.371 1061.01,477.121 1061.03,477.123C1067.7,477.897 1093.55,490.485 1098.6,493.084C1103.61,495.659 1108.31,498.803 1113.3,501.412C1114.58,502.081 1120.26,505.217 1122.59,503.249C1129.04,497.742 1121.61,484.258 1118.38,480.03C1105.46,463.153 1082.27,450.943 1062.9,443.424C1042.49,435.505 1021.39,429.3 1000.57,422.442C990.854,419.258 981.138,416.278 971.096,413.094C971.872,411.379 972.484,410.073 973.096,408.726C977.26,399.663 981.832,390.723 985.384,381.416C987.384,376.109 988.731,370.108 988.486,364.516C987.356,338.296 963.693,318.95 937.826,322.183C919.946,324.347 911.537,336.961 916.925,354.065C921.171,367.659 918.517,378.967 907.699,388.519C896.473,398.439 888.962,410.889 885.737,425.504C883.859,433.995 883.043,442.812 882.431,451.507C881.982,457.549 880.063,462.447 876.022,466.856C854.141,490.615 831.607,513.72 806.869,534.498C800.338,539.968 743.799,587.567 737.064,592.996C736.696,592.18 771.313,559.318 782.988,534.049C791.765,515.067 806.543,489.472 799.031,433.586C793.439,391.989 770.456,358.147 737.268,331.858C713.06,312.672 684.403,295.853 655.379,285.893C609.518,270.169 556.761,264.715 509.247,275.366C495.072,278.543 478.849,283.356 465.924,290.342C419.02,315.733 394.649,340.39 375.667,388.723C351.378,450.405 368.646,512.332 404.161,556.542C435.349,595.364 479.191,634.389 570.347,646.554C567.163,646.554 449.963,636.104 446.983,635.492C414.448,628.715 382.239,620.714 351.46,608.018C322.517,596.058 294.309,582.341 264.631,572.054C252.63,567.89 244.506,558.869 240.301,546.663C233.136,525.84 207.806,519.041 188.539,525.15C180.497,527.722 174.537,533.11 171.516,541.111C166.985,553.195 167.883,564.87 175.517,575.647C184.647,588.496 197.278,592.724 210.093,600.262C219.523,605.896 221.033,615.53 213.767,623.694C211.114,626.633 208.256,629.45 205.113,631.818C189.555,643.698 173.612,655.067 157.719,666.496C144.969,675.664 133.002,682.899 124.694,696.684C115.264,712.278 126.408,732.199 133.96,717.87C137.838,710.522 144.615,706.073 150.82,701.011C160.944,692.683 178.252,681.457 183.967,677.946C184.62,677.579 186.886,680.334 186.192,680.865C174.272,690.091 162.27,699.276 150.432,708.583C142.779,714.61 136.471,722.493 134.347,732.206C131.519,745.137 135.916,759.788 150.861,761.55C154.053,761.795 156.005,761.1 156.371,757.386C159.188,730.347 189.123,719.17 208.746,707.216C210.268,706.311 211.751,704.877 213.522,704.889C214.424,704.895 215.533,706.694 214.829,707.257C197.828,720.825 179.322,728.304 166.087,745.568C163.972,748.327 162.628,751.823 162.291,755.283C161.474,764.428 165.434,768.571 173.353,772.612C190.071,781.284 208.811,780.968 225.81,773.306C262.1,757.182 293.452,734.444 318.149,703.134C322.204,698.052 327.494,696.312 333.702,697.745C350.602,701.786 367.543,705.909 384.607,709.134C406.896,713.421 429.266,717.462 451.759,720.483C469.966,722.973 488.376,724.238 506.746,725.3C531.403,726.81 556.141,727.708 580.838,728.647C590.226,729.05 599.617,728.537 609.005,728.974C619.415,729.545 626.926,734.607 630.559,744.813C633.703,753.63 634.152,762.57 632.641,771.796C629.865,788.819 633.049,804.617 643.867,818.251C649.501,825.273 656.032,831.559 662.278,838.091C666.278,842.295 666.564,842.949 664.115,848.092C628.559,923.572 592.962,999.011 557.406,1074.45C553.152,1083.42 548.134,1085.53 538.832,1083.31C517.802,1078.08 496.201,1073.86 474.415,1075.59C456.086,1077.14 439.063,1082.29 423.919,1092.94C412.284,1101.19 404.732,1112.05 403.018,1126.46C402.905,1127.43 402.819,1128.39 402.76,1129.36C208.978,1042.38 74.8,841.338 77.633,627.436C78.37,571.789 85.827,517.248 102.366,464.009C123.453,396.126 158.008,332.588 203.235,277.775C248.12,223.377 303.458,177.667 365.441,144.003C428.991,109.489 499.28,87.704 571.248,80.44C645.02,72.994 720.049,80.333 790.872,102.337C858.76,123.428 922.302,157.99 977.118,203.222C1031.52,248.113 1077.23,303.456 1110.9,365.443C1136.61,412.783 1155.35,463.892 1166.13,516.684C1176.01,565.111 1179.34,614.819 1176.1,664.12C1164.57,839.613 1066.34,1002.05 917.076,1094.8ZM516.829,485.349C525.775,493.269 545.149,506.013 554.056,490.601C555.129,488.743 555.824,486.653 556.25,484.551C556.702,482.322 556.824,480.009 556.663,477.74C555.656,463.461 544.949,448.925 535.398,439.102C531.129,434.712 526.365,430.774 521.328,427.291C516.457,423.924 511.137,421.227 505.807,418.646C496.849,414.307 480.56,414.051 477.179,426.217C476.37,429.127 475.709,432.161 475.844,435.178C476.316,445.752 487.896,448.161 493.683,455.059C497.983,460.184 511.718,480.812 516.829,485.349ZM682.24,423.013C702.528,429.831 706.815,416.931 704.896,406.93C700.365,383.212 681.995,363.985 656.808,353.167C641.54,346.636 626.64,355.576 630.437,370.761C633.922,379.674 639.524,381.698 646.174,389.172C657.484,401.884 665.193,417.253 682.24,423.013Z"/>
            </g>
          </g>
        </g>
      </g>
      <g transform="matrix(1,0,0,1,388.289,304.284)">
        <rect x="-388.289" y="-304.284" width="1608.11" height="1608.11" style={{ fill: 'none' }} />
      </g>
    </svg>
  );
}