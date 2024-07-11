/*

states:
default
default, gaming, content_creation, productivity

*/

var JSON_data = {
  'default': {
    'default': {
      'bg': 'rl-bg-default_{0}.jpg',
      'bgh': 'rl-bg-default-highlight_{0}.jpg',
      'bgmask': 'rl-bg-default_{0}_mask.png',
      'pos': [
        [
          [544, 420],
          [605, 442],
          [667, 468],
          [732, 490],
          [806, 511],
          [873, 535]
        ],
        [
          [415, 485],
          [475, 508],
          [540, 535],
          [607, 560],
          [680, 583],
          [748, 608],
        ]
      ],
      'height': [
        [180, 230, 103, 178, 71, 50],
        [119, 99, 168, 71, 50, 33],
      ],
      'gfx_cap_height': [
        [54, 54, 60, 60, 55, 57],
        [57, 61, 62, 66, 59, 62],
      ],
      'gfx': [
        ['large_base_0.png', 'large_base_1.png', 'large_base_2.png', 'large_base_3.png', 'small_base_0.png', 'small_base_1.png'],
        ['large_base_4.png', 'large_base_5.png', 'large_base_6.png', 'large_base_7.png', 'small_base_2.png', 'small_base_3.png'],
      ],
      'decal_base': [
        ['large_base_decal_0_{0}.png', 'large_base_decal_1_{0}.png', 'large_base_decal_2_{0}.png', 'large_base_decal_3_{0}.png', 'small_base_decal_0_{0}.png', 'small_base_decal_1_{0}.png'],
        ['large_base_decal_4_{0}.png', 'large_base_decal_5_{0}.png', 'large_base_decal_6_{0}.png', 'large_base_decal_7_{0}.png', 'small_base_decal_2_{0}.png', 'small_base_decal_3_{0}.png'],
      ],
      'mask': [
        ['large_base_mask_0.png', 'large_base_mask_1.png', 'large_base_mask_2.png', 'large_base_mask_3.png', 'small_base_mask_0.png', 'small_base_mask_1.png'],
        ['large_base_mask_4.png', 'large_base_mask_5.png', 'large_base_mask_6.png', 'large_base_mask_7.png', 'small_base_mask_2.png', 'small_base_mask_3.png']
      ],
      'decal_overrides': [
        ['large_base_decal_0_gaming.png', 'large_base_decal_1_gaming.png', 'large_base_decal_2_content_creation.png', 'large_base_decal_3_gaming.png', 'small_base_decal_0_productivity.png', 'small_base_decal_1_content_creation.png'],
        ['large_base_decal_4_content_creation.png', 'large_base_decal_5_gaming.png', 'large_base_decal_6_gaming.png', 'large_base_decal_7_start.png', 'small_base_decal_2_gaming.png', 'small_base_decal_3_gaming.png'],
      ]
    },
    'gaming': {
      'height': [
        [190, 240, 110, 185, 70, 49],
        [123, 99, 172, 71, 52, 33],
      ],
    },
    'content_creation': {
      'height': [
        [140, 200, 101, 174, 70, 49],
        [127, 96, 142, 74, 52, 32],
      ],
    },
    'productivity': {
      'height': [
        [116, 164, 107, 125, 35, 0],
        [119, 95, 143, 76, 47, 35],
      ],
    }
  }
}