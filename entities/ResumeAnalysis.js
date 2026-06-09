{
  "name": "ResumeAnalysis",
  "type": "object",
  "properties": {
    "candidate_name": {
      "type": "string",
      "description": "Name of the candidate"
    },
    "file_url": {
      "type": "string",
      "description": "URL of the uploaded resume file"
    },
    "overall_score": {
      "type": "number",
      "description": "Overall resume score out of 100"
    },
    "fake_detection_score": {
      "type": "number",
      "description": "Likelihood of resume being fake (0-100)"
    },
    "ats_compatibility": {
      "type": "number",
      "description": "ATS compatibility score out of 100"
    },
    "skills_extracted": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "skill": {
            "type": "string"
          },
          "proficiency": {
            "type": "string"
          },
          "category": {
            "type": "string"
          }
        }
      }
    },
    "experience_analysis": {
      "type": "object",
      "properties": {
        "total_years": {
          "type": "number"
        },
        "career_progression": {
          "type": "string"
        },
        "job_gaps": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "consistency_score": {
          "type": "number"
        }
      }
    },
    "education_verification": {
      "type": "object",
      "properties": {
        "institutions": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "degrees": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "verification_status": {
          "type": "string"
        }
      }
    },
    "red_flags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Potential issues or red flags detected"
    },
    "strengths": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "improvements": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "analysis_details": {
      "type": "object",
      "properties": {
        "format_quality": {
          "type": "number"
        },
        "content_depth": {
          "type": "number"
        },
        "keyword_optimization": {
          "type": "number"
        },
        "readability": {
          "type": "number"
        }
      }
    },
    "suggested_jobs": {
      "type": "array",
      "description": "List of suitable jobs suggested by the AI",
      "items": {
        "type": "object",
        "properties": {
          "job_title": {
            "type": "string"
          },
          "reasoning": {
            "type": "string"
          },
          "match_score": {
            "type": "number"
          }
        }
      }
    }
  },
  "required": [
    "candidate_name",
    "file_url",
    "overall_score"
  ]
}   