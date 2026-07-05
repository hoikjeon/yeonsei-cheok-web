export interface NonCoveredItem {
  name: string;
  code: string;
  division: string;
  cost: string;
  minCost: string;
  maxCost: string;
  materialIncluded: string;
  drugIncluded: string;
  note: string;
  updateDate: string;
}

export interface NonCoveredGroup {
  categoryName: string;
  items: NonCoveredItem[];
}

export interface NonCoveredSection {
  title: string;
  groups: NonCoveredGroup[];
}

export const nonCoveredData: NonCoveredSection[] = [
  {
    "title": "1장. 행위료",
    "groups": []
  },
  {
    "title": "1-1장. 상급병실료 차액",
    "groups": [
      {
        "categoryName": "상급병실료차액",
        "items": [
          {
            "name": "1인실 상급병실료",
            "code": "ABZ01",
            "division": "",
            "cost": "150,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      }
    ]
  },
  {
    "title": "2장. 검사료",
    "groups": [
      {
        "categoryName": "평형 및 청각기능검사",
        "items": [
          {
            "name": "동적체평형검사(3D)",
            "code": "FZ731",
            "division": "",
            "cost": "150,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "외피,근골기능검사",
        "items": [
          {
            "name": "체온열검사(DITI)-전신",
            "code": "EZ776",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "250,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "체온열검사(DITI)-두경부",
            "code": "EZ776",
            "division": "",
            "cost": "200,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "체온열검사(DITI)-상지",
            "code": "EZ776",
            "division": "",
            "cost": "",
            "minCost": "50,000",
            "maxCost": "100,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "체온열검사(DITI)-하지",
            "code": "EZ776",
            "division": "",
            "cost": "",
            "minCost": "50,000",
            "maxCost": "100,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "기타검사",
        "items": [
          {
            "name": "SAA(아밀로이드 A)",
            "code": "CZ242",
            "division": "",
            "cost": "70,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "IMA(허혈성 변형 알부민 검사)",
            "code": "CZ246",
            "division": "",
            "cost": "70,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "동맥경화도검사(맥파전달속도측정)CORONYZER",
            "code": "EZ868",
            "division": "",
            "cost": "120,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "인플루엔자 A,B 바이러스항원검사",
            "code": "CZ394",
            "division": "",
            "cost": "20,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "SARS-CoV-2 항원검사 [일반면역검사]-간이검사",
            "code": "CZ019",
            "division": "",
            "cost": "20,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      }
    ]
  },
  {
    "title": "2-1장. 초음파검사료",
    "groups": [
      {
        "categoryName": "초음파 검사료",
        "items": [
          {
            "name": "외래 유도 초음파 (OS SONO GUIDE)",
            "code": "EB562",
            "division": "",
            "cost": "20,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "Doppler Carotid A",
            "code": "EB482",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": "2025.11.06"
          },
          {
            "name": "Echo cardiography",
            "code": "EB432",
            "division": "",
            "cost": "150,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      }
    ]
  },
  {
    "title": "3-1장. 초음파 영상료",
    "groups": [
      {
        "categoryName": "초음파 영상료",
        "items": [
          {
            "name": "수술 중 초음파 (상지)",
            "code": "EZ985",
            "division": "",
            "cost": "",
            "minCost": "20,000",
            "maxCost": "100,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      }
    ]
  },
  {
    "title": "3-2장. 자기공명영상진단료",
    "groups": [
      {
        "categoryName": "뇌",
        "items": [
          {
            "name": "뇌-일반",
            "code": "HE101",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "400,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "뇌-조영제 주입 전·후 촬영 판독",
            "code": "HE201",
            "division": "",
            "cost": "500,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "두경부",
        "items": [
          {
            "name": "경부-일반",
            "code": "HE108",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "500,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "경부-조영제 주입 전·후 촬영 판독",
            "code": "HE208",
            "division": "",
            "cost": "500,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "척추",
        "items": [
          {
            "name": "경추-일반",
            "code": "HE109",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "700,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "경추-조영제 주입 전·후 촬영 판독",
            "code": "HE209",
            "division": "",
            "cost": "",
            "minCost": "500,000",
            "maxCost": "600,000",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "경추-추간공",
            "code": "HE109",
            "division": "",
            "cost": "600,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "경추-제한적 MRI",
            "code": "HE409",
            "division": "",
            "cost": "300,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "흉추-일반",
            "code": "HE110",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "600,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "흉추-조영제 주입 전·후 촬영 판독",
            "code": "HE210",
            "division": "",
            "cost": "",
            "minCost": "500,000",
            "maxCost": "600,000",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "요추-추간공",
            "code": "HE111",
            "division": "",
            "cost": "600,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "흉추-제한적 MRI",
            "code": "HE410",
            "division": "",
            "cost": "300,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "요천추-일반",
            "code": "HE111",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "700,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "요천추-조영제 주입 전·후 촬영 판독",
            "code": "HE211",
            "division": "",
            "cost": "",
            "minCost": "500,000",
            "maxCost": "600,000",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "요천추-제한적 MRI",
            "code": "HE411",
            "division": "",
            "cost": "300,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "척추강-일반",
            "code": "HE112",
            "division": "",
            "cost": "",
            "minCost": "",
            "maxCost": "200,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "MRI 척추 - 경추 흉추, 요천추와 동시촬영",
            "code": "HE114",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "근골격계",
        "items": [
          {
            "name": "견관절-일반",
            "code": "HE115",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "450,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "견관절-조영제 주입 전·후 촬영 판독",
            "code": "HE215",
            "division": "",
            "cost": "550,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "견관절-제한적 MRI",
            "code": "HE415",
            "division": "",
            "cost": "350,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "주관절-일반",
            "code": "HE116",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "450,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "주관절-조영제 주입 전·후 촬영 판독",
            "code": "HE216",
            "division": "",
            "cost": "550,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "주관절-제한적 MRI",
            "code": "HE416",
            "division": "",
            "cost": "350,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "수관절-일반",
            "code": "HE117",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "450,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "수관절-조영제 주입 전·후 촬영 판독",
            "code": "HE217",
            "division": "",
            "cost": "550,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "수관절-제한적 MRI",
            "code": "HE417",
            "division": "",
            "cost": "350,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "고관절-일반",
            "code": "HE118",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "450,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "고관절-조영제 주입 전·후 촬영 판독",
            "code": "HE218",
            "division": "",
            "cost": "550,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "고관절-제한적 MRI",
            "code": "HE418",
            "division": "",
            "cost": "350,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "천장고관절-일반",
            "code": "HE119",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "450,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "천장고관절-조영제 주입 전·후 촬영 판독",
            "code": "HE219",
            "division": "",
            "cost": "550,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "천장고관절-제한적 MRI",
            "code": "HE419",
            "division": "",
            "cost": "350,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "슬관절-일반",
            "code": "HE120",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "450,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "슬관절-조영제 주입 전·후 촬영 판독",
            "code": "HE220",
            "division": "",
            "cost": "550,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "슬관절-제한적 MRI",
            "code": "HE420",
            "division": "",
            "cost": "350,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "발목관절-일반",
            "code": "HE121",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "450,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "발목관절-조영제 주입 전·후 촬영 판독",
            "code": "HE221",
            "division": "",
            "cost": "550,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "발목관절-제한적 MRI",
            "code": "HE421",
            "division": "",
            "cost": "350,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "관절외 상지-일반",
            "code": "HE122",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "450,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "관절외 상지-조영제 주입 전·후 촬영 판독",
            "code": "HE222",
            "division": "",
            "cost": "550,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "관절외 상지-제한적 MRI",
            "code": "HE422",
            "division": "",
            "cost": "350,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "관절외 하지-일반",
            "code": "HE122",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "450,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "관절외 하지-조영제 주입 전·후 촬영 판독",
            "code": "HE223",
            "division": "",
            "cost": "550,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "관절외 하지-제한적 MRI",
            "code": "HE423",
            "division": "",
            "cost": "350,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "골반-일반",
            "code": "HE128",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "450,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "골반-조영제 주입 전·후 촬영 판독",
            "code": "HE228",
            "division": "",
            "cost": "550,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "혈관",
        "items": [
          {
            "name": "뇌혈관-일반",
            "code": "HE135",
            "division": "",
            "cost": "",
            "minCost": "100,000",
            "maxCost": "400,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "뇌혈관-조영제 주입 전·후",
            "code": "HE235",
            "division": "",
            "cost": "500,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "조영제 비용 포함",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "특수검사",
        "items": [
          {
            "name": "확산-기본검사 동시",
            "code": "HF201",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "기타",
        "items": [
          {
            "name": "자기공명영상-외부필름판독",
            "code": "",
            "division": "",
            "cost": "40,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      }
    ]
  },
  {
    "title": "7장. 이학요법료(물리치료료)",
    "groups": [
      {
        "categoryName": "물리치료료",
        "items": [
          {
            "name": "도수치료 A [1일당]",
            "code": "DOSU8",
            "division": "",
            "cost": "40,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "도수치료 B [1일당]",
            "code": "DOSU1",
            "division": "",
            "cost": "70,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "도수치료 C [1일당]",
            "code": "DOSU4",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "도수 E(A+ESWT) [1일당]",
            "code": "DOSU10",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "도수 P(A+PAIN) [1일당]",
            "code": "DOSU11",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "CRYO 신장분사치료",
            "code": "CRYO",
            "division": "",
            "cost": "20,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "1부위",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "CRYO 신장분사치료 2",
            "code": "CRYO1",
            "division": "",
            "cost": "30,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "2부위",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "CRYO 신장분사치료(케미로사)",
            "code": "CRYO2",
            "division": "",
            "cost": "7,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "비침습적 무통증 신호요법 (PAIN BLOCK)",
            "code": "SCRA",
            "division": "",
            "cost": "60,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "ESWT (체외충격파치료) 1800",
            "code": "PT21",
            "division": "",
            "cost": "60,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "ESWT (체외충격파치료) 3600",
            "code": "PT20",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "증식치료(사지관절부위)",
            "code": "MY142",
            "division": "",
            "cost": "",
            "minCost": "20,000",
            "maxCost": "40,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "부위별",
            "updateDate": ""
          },
          {
            "name": "증식치료(척추)",
            "code": "MY143",
            "division": "",
            "cost": "",
            "minCost": "200,000",
            "maxCost": "300,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "부위별",
            "updateDate": ""
          }
        ]
      }
    ]
  },
  {
    "title": "9장. 처치 및 수술료",
    "groups": [
      {
        "categoryName": "근골",
        "items": [
          {
            "name": "추간판내 고주파 열치료술",
            "code": "SZ083",
            "division": "",
            "cost": "",
            "minCost": "400,000",
            "maxCost": "1,000,000",
            "materialIncluded": "X",
            "drugIncluded": "",
            "note": "Level당 산정",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "신경",
        "items": [
          {
            "name": "경피적 경막외강 신경성형술",
            "code": "SZ634",
            "division": "",
            "cost": "600,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "X",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "내시경적 경막외강 유착박리술",
            "code": "SZ631",
            "division": "",
            "cost": "",
            "minCost": "500,000",
            "maxCost": "1,300,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "Level당 산정",
            "updateDate": ""
          },
          {
            "name": "경피적 풍선확장 경막외강 신경성형술",
            "code": "SZ641",
            "division": "",
            "cost": "",
            "minCost": "900,000",
            "maxCost": "1,100,000",
            "materialIncluded": "X",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "신의료기술",
        "items": [
          {
            "name": "무릎 골관절염 PRP",
            "code": "",
            "division": "",
            "cost": "250,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "회전근개봉합술 PRP",
            "code": "",
            "division": "",
            "cost": "450,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "(BMAC)무릎 골관절염 골수 흡인 농축물 관절강내 주사",
            "code": "",
            "division": "",
            "cost": "2,500,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "O",
            "drugIncluded": "",
            "note": "",
            "updateDate": "2024.01.09"
          }
        ]
      },
      {
        "categoryName": "기타",
        "items": [
          {
            "name": "보호자식",
            "code": "",
            "division": "",
            "cost": "5,700",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "공기밥",
            "code": "",
            "division": "",
            "cost": "1,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "환의 대여료",
            "code": "",
            "division": "",
            "cost": "20,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      }
    ]
  },
  {
    "title": "10장. 치료재료대",
    "groups": [
      {
        "categoryName": "추간판내 고주파 열치료술",
        "items": [
          {
            "name": "DISC SPINE",
            "code": "BF0201LK",
            "division": "",
            "cost": "2,000,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "경막외강 신경박리술 및 감압 신경성형술용",
        "items": [
          {
            "name": "ABEL EPIDURAL CATHETER",
            "code": "BJ4801GZ",
            "division": "",
            "cost": "1,400,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "JENITH LUMBAR-200",
            "code": "BJ4803LK",
            "division": "",
            "cost": "1,400,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "경피적 풍선확장 경막외강 신경성형",
        "items": [
          {
            "name": "JENITH BALLOON",
            "code": "BJ4802LK",
            "division": "",
            "cost": "1,600,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "내시경적 경막외강 유착박리술",
        "items": [
          {
            "name": "EXCAVA",
            "code": "BJ4816RA",
            "division": "",
            "cost": "2,700,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "척추극돌기간고정용",
        "items": [
          {
            "name": "DIAM",
            "code": "BF0402AW",
            "division": "",
            "cost": "3,100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "척추경막외 유착방지제",
        "items": [
          {
            "name": "원더씰(WONDERSEAL)",
            "code": "BF0100HO",
            "division": "",
            "cost": "1,000,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "Interblock",
            "code": "BF0100VD",
            "division": "",
            "cost": "1,000,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "인체조직유래 2차 가공뼈",
        "items": [
          {
            "name": "(DBM)DEMIOS 1cc",
            "code": "BC0101KJ",
            "division": "",
            "cost": "700,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "SUREFUSE-TM",
            "code": "BC0101OT",
            "division": "",
            "cost": "",
            "minCost": "500,000",
            "maxCost": "1,500,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "EXFUSE DBM 3cc",
            "code": "BC0101ED",
            "division": "",
            "cost": "1,000,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": "2024.06.07"
          }
        ]
      },
      {
        "categoryName": "압박고정용 SPLINT",
        "items": [
          {
            "name": "Wrist splint",
            "code": "BC1218PR",
            "division": "",
            "cost": "30,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "Thumb brace",
            "code": "BC1209RE",
            "division": "",
            "cost": "20,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "보조기",
        "items": [
          {
            "name": "요추부 보조기 (LSO)",
            "code": "BC1200BH",
            "division": "",
            "cost": "300,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "흉,요추부 보조기 (TLSO)",
            "code": "BC1200BH",
            "division": "",
            "cost": "350,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "BACK BRACE",
            "code": "BC1200BH",
            "division": "",
            "cost": "200,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "Miami collar (마이애미)",
            "code": "BC1202VP",
            "division": "",
            "cost": "200,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "PHILADELPHIA",
            "code": "BC1201VP",
            "division": "",
            "cost": "120,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "Corset(밴드형)",
            "code": "BC1241RE",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "TOMAS COLLAR",
            "code": "BC1203RE",
            "division": "",
            "cost": "50,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "비침습적지혈용",
        "items": [
          {
            "name": "ADFLEX-SI (30mm*72mm)",
            "code": "K9206119",
            "division": "",
            "cost": "2,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "WOUNDCLOT & WOUNDCLOT TRAUMA[5CM*5CM]",
            "code": "K9205337",
            "division": "",
            "cost": "50,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "HEMOBLOCK",
            "code": "K9205003",
            "division": "",
            "cost": "50,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "M-Clot",
            "code": "K9205250",
            "division": "",
            "cost": "50,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "KIONOID",
            "code": "K9205337",
            "division": "",
            "cost": "50,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "드레싱 고정류",
        "items": [
          {
            "name": "옥시프로브센서",
            "code": "BM5101KH",
            "division": "",
            "cost": "25,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "이지픽스엘",
            "code": "BM5101SZ",
            "division": "",
            "cost": "25,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "COMFY WARM",
            "code": "BM5100KM",
            "division": "",
            "cost": "1,000,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "Super Fix",
            "code": "BM5110BL",
            "division": "",
            "cost": "5,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "압박고정용(탄력반창고)",
        "items": [
          {
            "name": "토니밴드(방수밴드)",
            "code": "BK7000CL",
            "division": "",
            "cost": "50,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "Plio 상/하지(스타키넷)",
            "code": "BK7002NC",
            "division": "",
            "cost": "20,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "토니락",
            "code": "BK7000PJ",
            "division": "",
            "cost": "30,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "상처고정및 보호용",
        "items": [
          {
            "name": "MICROPORE S SURGICAL TAPE",
            "code": "BM2009EA",
            "division": "",
            "cost": "5,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "마취과 실리콘테이프",
            "code": "BM2001SS",
            "division": "",
            "cost": "20,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "압박고정용치료재료",
        "items": [
          {
            "name": "아이스팩(knee)",
            "code": "BC1002RL",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "아이스팩(shoulder)",
            "code": "BC1206RL",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "STRAP BAND",
            "code": "BC1001GQ",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "CARE BOARD",
            "code": "BM1200VO",
            "division": "",
            "cost": "50,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "연조직재건용",
        "items": [
          {
            "name": "ACE COL",
            "code": "BM2600VT",
            "division": "",
            "cost": "1,800,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "인콜(INCOL) 1ml",
            "code": "BM2600RH",
            "division": "",
            "cost": "1,800,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "ANTIRA",
            "code": "BM2600FF",
            "division": "",
            "cost": "1,800,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "자착성 탄력붕대",
        "items": [
          {
            "name": "PENKO SUPPORT W BAND",
            "code": "BK7103JP",
            "division": "",
            "cost": "5,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "UNIBAND 3\",4\",6\"",
            "code": "BK7100AM",
            "division": "",
            "cost": "",
            "minCost": "6,000",
            "maxCost": "10,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "사이즈별",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "OSTOMY용 ACCESSORY",
        "items": [
          {
            "name": "Velpeau band(벨포 밴드)",
            "code": "",
            "division": "",
            "cost": "15,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      },
      {
        "categoryName": "기타",
        "items": [
          {
            "name": "arm sling",
            "code": "",
            "division": "",
            "cost": "8,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "Color Cast Shoes",
            "code": "",
            "division": "",
            "cost": "10,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "목발 (crutches 1쌍)",
            "code": "",
            "division": "",
            "cost": "20,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      }
    ]
  },
  {
    "title": "11장. 약제비",
    "groups": [
      {
        "categoryName": "기타",
        "items": [
          {
            "name": "베노스타신캡슐",
            "code": "621803330",
            "division": "",
            "cost": "720",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "둘코락스에스장용정",
            "code": "0 74200060",
            "division": "",
            "cost": "500",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "둘코락스좌약",
            "code": "0 74200080",
            "division": "급비확인",
            "cost": "800",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "훼스탈플러스정",
            "code": "652101720",
            "division": "",
            "cost": "300",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "프로제아",
            "code": "650304561",
            "division": "",
            "cost": "70,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "리박트과립",
            "code": "643900250",
            "division": "",
            "cost": "4,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "인카인겔11ml",
            "code": "657401421",
            "division": "",
            "cost": "15,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "맥시제식주 100ml",
            "code": "665003111",
            "division": "",
            "cost": "80,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "핵시타놀이티2%액",
            "code": "657400860",
            "division": "",
            "cost": "25,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "제이세덱스주50ML",
            "code": "678901241",
            "division": "",
            "cost": "50,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "네프콤주사액2ml(네포팜염산염)",
            "code": "665001971",
            "division": "",
            "cost": "11,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "이부케이주",
            "code": "641807141",
            "division": "",
            "cost": "20,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "헤파린나트륨주사100IU 10ml",
            "code": "670605471",
            "division": "",
            "cost": "4,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "중외5%포도당주사액(10g/200ml)",
            "code": "644902252",
            "division": "",
            "cost": "3,500",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "하이디알 주",
            "code": "665480227",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "헤모펜스헤모스태틱(트롬빈)",
            "code": "654802580",
            "division": "",
            "cost": "700,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": "2024.04.01"
          },
          {
            "name": "스폰고스탄",
            "code": "650800260",
            "division": "",
            "cost": "15,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": "2024.04.01"
          },
          {
            "name": "리포라제주1500iu 1.0ml",
            "code": "669904600",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "슈가 덱스 주",
            "code": "653405071",
            "division": "",
            "cost": "120,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "후시딘 연고 10g",
            "code": "642703972",
            "division": "",
            "cost": "8,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "위너프페리주",
            "code": "678900994",
            "division": "",
            "cost": "150,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "오마프원페리주",
            "code": "640006700",
            "division": "",
            "cost": "100,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "엘아르기닌염산염주 10% 100mL (바이알)",
            "code": "645104341",
            "division": "",
            "cost": "60,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "중외 엔에스 주사액 110ml",
            "code": "678900971",
            "division": "",
            "cost": "5,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "네오미화겐씨주20mL",
            "code": "655560142",
            "division": "",
            "cost": "25,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "바이온 주",
            "code": "662502981",
            "division": "",
            "cost": "25,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "오메가벤 주 50ml",
            "code": "650901951",
            "division": "",
            "cost": "70,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          }
        ]
      }
    ]
  },
  {
    "title": "4. 제증명료",
    "groups": [
      {
        "categoryName": "기타",
        "items": [
          {
            "name": "일반진단서",
            "code": "PDZ01",
            "division": "",
            "cost": "",
            "minCost": "1,000",
            "maxCost": "20,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "최저비용은 재발행용",
            "updateDate": ""
          },
          {
            "name": "상해진단서 3주 미만",
            "code": "PDZ02",
            "division": "",
            "cost": "",
            "minCost": "10,000",
            "maxCost": "100,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "최저비용은 재발행용",
            "updateDate": ""
          },
          {
            "name": "상해진단서 3주 이상",
            "code": "PDZ02",
            "division": "",
            "cost": "",
            "minCost": "10,000",
            "maxCost": "150,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "최저비용은 재발행용",
            "updateDate": ""
          },
          {
            "name": "사망진단서",
            "code": "PDZ03",
            "division": "",
            "cost": "",
            "minCost": "1,000",
            "maxCost": "10,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "최저비용은 재발행용",
            "updateDate": ""
          },
          {
            "name": "후유장애진단서(AMA,맥브라이드)",
            "code": "PDZ07",
            "division": "",
            "cost": "",
            "minCost": "10,000",
            "maxCost": "100,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "최저비용은 재발행용",
            "updateDate": ""
          },
          {
            "name": "병사용진단서",
            "code": "PDZ08",
            "division": "",
            "cost": "",
            "minCost": "5,000",
            "maxCost": "20,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "최저비용은 재발행용",
            "updateDate": ""
          },
          {
            "name": "입퇴원 확인서",
            "code": "PDZ09",
            "division": "",
            "cost": "3,000",
            "minCost": "1,000",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "장당가격",
            "updateDate": ""
          },
          {
            "name": "통원(진료)확인서",
            "code": "PDZ09",
            "division": "",
            "cost": "3,000",
            "minCost": "1,000",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "장당가격",
            "updateDate": ""
          },
          {
            "name": "국민연금장애 진단서",
            "code": "PDZ10",
            "division": "",
            "cost": "15,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "의무기록사본발급",
            "code": "PDZ11",
            "division": "",
            "cost": "",
            "minCost": "100",
            "maxCost": "1,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "첫장만 1,000원 이후 100원",
            "updateDate": ""
          },
          {
            "name": "소견서",
            "code": "PDZ12",
            "division": "",
            "cost": "",
            "minCost": "1,000",
            "maxCost": "10,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "최저비용은 재발행용",
            "updateDate": ""
          },
          {
            "name": "향후진료비추정서",
            "code": "PDZ14",
            "division": "",
            "cost": "",
            "minCost": "1,000",
            "maxCost": "50,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "최저비용은 재발행용",
            "updateDate": ""
          },
          {
            "name": "영문진단서",
            "code": "PDE01",
            "division": "",
            "cost": "",
            "minCost": "1,000",
            "maxCost": "20,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "최저비용은 재발행용",
            "updateDate": ""
          },
          {
            "name": "수술확인서",
            "code": "",
            "division": "",
            "cost": "",
            "minCost": "1,000",
            "maxCost": "3,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "최저비용은 재발행용",
            "updateDate": ""
          },
          {
            "name": "방사선 등 영상진단 CD복사수수료",
            "code": "",
            "division": "",
            "cost": "10,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "개당 가격",
            "updateDate": ""
          },
          {
            "name": "근로능력평가서",
            "code": "",
            "division": "",
            "cost": "10,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "노인장기요양보험 의사소견서 10%",
            "code": "",
            "division": "",
            "cost": "3,750",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "노인장기요양보험 의사소견서 20%",
            "code": "",
            "division": "",
            "cost": "7,510",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "노인장기요양보험 의사소견서 100%",
            "code": "",
            "division": "",
            "cost": "37,590",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "동사무소 장애진단서",
            "code": "",
            "division": "",
            "cost": "15,000",
            "minCost": "",
            "maxCost": "",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "",
            "updateDate": ""
          },
          {
            "name": "개인보험 장애진단서",
            "code": "",
            "division": "",
            "cost": "",
            "minCost": "10,000",
            "maxCost": "100,000",
            "materialIncluded": "",
            "drugIncluded": "",
            "note": "최저비용은 재발행용",
            "updateDate": ""
          }
        ]
      }
    ]
  }
];
