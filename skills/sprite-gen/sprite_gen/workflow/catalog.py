# SPDX-License-Identifier: Apache-2.0
# Modified by Agent Skills Studio: normalized user-facing workflow labels to English.
"""The two user journeys and their selectable fields, declared once."""
from sprite_gen.gen import PROVIDERS

MOTION_METHODS = {
    "gpt-rows": {"label": "GPT image sprites", "provider": "codex", "doc": "docs/atlas-workflow.md",
                 "steps": ["prepare", "gen-set", "extract", "compose-atlas", "compose-gif"]},
    "grok-video": {"label": "Grok video", "provider": "grok", "doc": "docs/video-pipeline.md",
                   "steps": ["video-set"]},
}
FIELDS = {
    "image_provider": {"options": dict(zip(PROVIDERS, ("GPT", "Grok"))),
                       "question": "Should the image be created with GPT or Grok?"},
    "motion_method": {"options": {k: v["label"] for k, v in MOTION_METHODS.items()},
                      "question": "Should motion use Grok video or GPT image sprites?"},
    "curation": {"options": {"open": "Open", "skip": "Skip"},
                 "question": "Would you like to review and select the results in the curation view?"},
}
FLOWS = {
    "sprite": {"label": "Create sprites", "fields": ("image_provider", "motion_method", "curation")},
    "image": {"label": "Create an image", "fields": ("image_provider", "curation")},
}


def validate_choices(kind: str, choices: dict) -> dict:
    if kind not in FLOWS:
        raise ValueError(f"unknown workflow: {kind}")
    if not isinstance(choices, dict):
        raise ValueError("workflow choices must be an object")
    for key, value in choices.items():
        if key not in FLOWS[kind]["fields"] or not isinstance(value, str) or value not in FIELDS[key]["options"]:
            raise ValueError(f"invalid {kind} choice: {key}")
    return dict(choices)
